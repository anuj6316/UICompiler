You need to model **3 distinct layers** in your ER design:

1. **User + Auth**
2. **Generation session**
3. **Wireframe variants + final output**

---

## 1. Core ER Model (clean + scalable)

### A. Users

```sql
users
- id (PK)
- email (unique)
- password_hash
- created_at
```

---

### B. Generations (one upload session)

Represents **one sketch upload**

```sql
generations
- id (PK)
- user_id (FK → users.id)
- image_path
- status (pending | wireframe_generated | completed | failed)
- selected_variant_id (FK → wireframe_variants.id, nullable)
- created_at
```

---

### C. Wireframe Variants (key table)

This is your **decision layer**

```sql
wireframe_variants
- id (PK)
- generation_id (FK → generations.id)
- layout_json (JSONB)
- label (e.g. "Sidebar layout")
- score (float, optional)
- preview_cache (optional: HTML snapshot / SVG)
- created_at
```

👉 1 generation → N variants

---

### D. Final Generated Code

Only created **after selection**

```sql
generated_outputs
- id (PK)
- generation_id (FK → generations.id)
- variant_id (FK → wireframe_variants.id)
- jsx_code (TEXT)
- metadata (JSONB)
- created_at
```

---

## 2. Relationships (important)

```id="4z0nqf"
User (1) ─── (N) Generations

Generation (1) ─── (N) WireframeVariants

Generation (1) ─── (1) Selected Variant (via FK)

Selected Variant (1) ─── (1) GeneratedOutput
```

---

## 3. Why this structure works

### Separation of concerns

* `generations` → lifecycle
* `wireframe_variants` → exploration space
* `generated_outputs` → final artifact

---

## 4. Django ORM version (production-ready)

```python
class Generation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="sketches/")
    status = models.CharField(max_length=32)
    selected_variant = models.ForeignKey(
        "WireframeVariant",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class WireframeVariant(models.Model):
    generation = models.ForeignKey(Generation, on_delete=models.CASCADE, related_name="variants")
    layout_json = models.JSONField()
    label = models.CharField(max_length=100)
    score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class GeneratedOutput(models.Model):
    generation = models.OneToOneField(Generation, on_delete=models.CASCADE)
    variant = models.ForeignKey(WireframeVariant, on_delete=models.CASCADE)
    jsx_code = models.TextField()
    metadata = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 5. State machine (VERY important)

```id="n6zz6w"
pending
  ↓
wireframe_generated
  ↓ (user selects)
variant_selected
  ↓
completed
```

---

## 6. API mapping

### Generate wireframes

```http
POST /api/generations/
```

Creates:

* 1 generation
* N wireframe_variants

---

### Get variants

```http
GET /api/generations/{id}/variants
```

---

### Select variant

```http
POST /api/generations/{id}/select
{
  "variant_id": X
}
```

→ updates:

```sql
generations.selected_variant_id = X
```

---

### Generate final code

Triggered **only after selection**

---

## 7. Performance considerations

* Index:

```sql
CREATE INDEX idx_generation_user ON generations(user_id);
CREATE INDEX idx_variant_generation ON wireframe_variants(generation_id);
```

* Store `layout_json` as **JSONB** (Postgres)
* Avoid storing preview images unless caching needed

---

## 8. Optional (advanced but useful)

### A. Versioning (if user regenerates variants)

```sql
generation_versions
- id
- generation_id
- version_number
```

---

### B. Feedback loop (for ranking model)

```sql
variant_feedback
- id
- variant_id
- user_selected (bool)
```

---

## 9. Common mistake (avoid)

❌ Storing variants inside generation JSON
→ unqueryable, no indexing, no scaling

✔ Always normalize variants as a separate table

---

## 10. Minimal working schema (if you want to move fast)

Only 3 tables:

```id="9kb1r6"
users
generations
wireframe_variants
```

Add `generated_outputs` later.

---

If next step:
I can give you:

* **PostgreSQL schema with constraints + JSON schema validation**
* or **optimized query patterns for history + pagination (important for your PRD)**


