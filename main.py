from transformers import AutoProcessor, AutoModelForImageTextToText, BitsAndBytesConfig, AutoModelForCausalLM
import torch
from PIL import Image
import os
import re
# Source - https://stackoverflow.com/a/52463183
# Posted by Kinght 金, modified by community. See post 'Timeline' for change history
# Retrieved 2026-03-27, License - CC BY-SA 4.0

#!/usr/bin/python3
# 2018/09/23 17:29 (CST) 
# (中秋节快乐)
# (Happy Mid-Autumn Festival)

import cv2 
import numpy as np 

# fname = "color.png"
# bgray = cv2.imread(fname)[...,0]

# blured1 = cv2.medianBlur(bgray,3)
# blured2 = cv2.medianBlur(bgray,51)
# divided = np.ma.divide(blured1, blured2).data
# normed = np.uint8(255*divided/divided.max())
# th, threshed = cv2.threshold(normed, 100, 255, cv2.THRESH_OTSU)

# dst = np.vstack((bgray, blured1, blured2, normed, threshed)) 
# cv2.imwrite("dst.png", dst)

def iter_images(root, exts={'.jpg', '.jpeg', '.png', '.bmp', '.webp'}):
    stack = [root]
    while stack:
        d = stack.pop()
        with os.scandir(d) as it:
            for e in it:
                if e.is_dir(follow_symlinks=False):
                    stack.append(e.path)
                elif e.is_file():
                    if os.path.splitext(e.name)[1].lower() in exts:
                        yield e.path

class OCR:
    """
models:
microsoft/Florence-2-large
Qwen/Qwen3-VL-2B-Instruct
HuggingFaceTB/SmolVLM-256M-Instruct
    """
    def __init__(self, model_id="microsoft/Florence-2-large"):
        self.model_id = model_id
        self.model, self.processor = self.load_model()
        self.prompt = "here extract the information from the image and don't anythings else."

    def load_model(self):
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",          # "nf4" or "fp4"
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_use_double_quant=True,     # nested quantization, saves ~0.4 bits/param
        )
        model = AutoModelForImageTextToText.from_pretrained(
            self.model_id,
            # quantization_config=bnb_config,
            # quantization_config=None,
            # tokenize=True,
            # torch_dtype=torch.bfloat16,
            device_map="auto",
            dtype="auto"
            # torch_dtype="auto"
        )
        processor = AutoProcessor.from_pretrained(self.model_id)
        return model, processor

    def generate_res(self, image_path):
        image = Image.open(image_path).convert("RGB")
        image.load() # Ensure image is loaded before processing
        # bgray = cv2.imread(image_path)[...,0]

        # blured1 = cv2.medianBlur(bgray,3)
        # blured2 = cv2.medianBlur(bgray,51)
        # divided = np.ma.divide(blured1, blured2).data
        # normed = np.uint8(255*divided/divided.max())
        # th, threshed = cv2.threshold(normed, 100, 255, cv2.THRESH_OTSU)

        # # dst = np.vstack((bgray, blured1, blured2, normed, threshed)) 
        # dst = np.vstack((threshed)) 

        # cv2.imwrite(f"{image_path}_gray.png", dst)

        conversation = [
            {
                "role": "user",
                "content": [
                    {"type": "image", "image": image},
                    {"type": "text", "text": self.prompt},
                ],
            }
        ]

        inputs = self.processor.apply_chat_template(
            conversation,
            add_generation_prompt=True,
            return_tensors="pt",
            return_dict=True,
            tokenize=True,
        ).to(self.model.device)

        outputs = self.model.generate(**inputs, max_new_tokens=64)
        return self.processor.batch_decode(outputs, skip_special_tokens=True)[0]

ocr = OCR()
if os.path.exists(f"output.csv"):
    os.remove(f"output.csv")

for path in iter_images("/home/mindmap/Desktop/UICompiler/new 4/new/UNTNO"):
    try:
        text = ocr.generate_res(path)
        match = re.search(r"Assistant:\s*(.*)", text)
        result = match.group(1) if match else None
        # match = re.search(r'\{.*?\}', text, re.DOTALL)
        # if match:
        #     text = match.group(0)
        
        output = {
            "path": path,
            "response": result
        }
        with open(f"output.csv", "a") as f:
            f.write(f"{path},{result}\n")
        # import json
        # json.dump(eval(output), open(f"{path}.json", "w"))
        print(f"\n\n{path}\n{text}\n{result}")
    except Exception as e:
        print(f"Failed: {path} — {e}")