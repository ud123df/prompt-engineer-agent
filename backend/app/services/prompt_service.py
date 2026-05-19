import os 
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client =  Groq(
   
    api_key = os.getenv("GROQ_API_KEY")
)
def generate_prompt(task):
    system_prompt = """
    You are an expert prompt engineer.

    Your task:
    - Analyze user intent
    - Create optimized prompts
    - Add structure
    - Improve clarity
    - Add constraints
    - Improve output quality
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": task
            }
        ],
        temperature=0.7,
        max_tokens=1024
    )

    return completion.choices[0].message.content