import time

class LogExecutionTime:
    def __init__(self, func):
        self.func = func  # store the decorated function

    def __call__(self, *args, **kwargs):
        start_time = time.time()
        result = self.func(*args, **kwargs)  # execute the function
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"Execution time of {self.func.__name__}: {execution_time:.4f} seconds")
        return result