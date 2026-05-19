import os 
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def optimizer_prompt(prompt):
    system_prompt = """
    You are an elite Prompt Optimization 

    Your task:
    - Improve vague prompts
    - Add clarity
    - Add constraints
    - Improve structure
    - Increase AI output quality 
    - Keep prompts professional 
"""

    completion = client.chat.completions.create(
        model = "llama-3.1-8b-instant",
        messages=[{
            "role":"system",
            "content": system_prompt
        },
        {
            "role":"user",
            "content":prompt
        }
        ],
        temperature=0.7,
        max_tokens=1024
    )
    return completion.choices[0].message.content