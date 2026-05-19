import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def evaluate_prompt(prompt):

    system_prompt = """
    You are an AI Prompt Evaluation Expert.

    Evaluate prompts based on:

    1. Clarity
    2. Specificity
    3. Structure
    4. Output Reliability
    5. Hallucination Risk
    6. Token Efficiency

    Return:
    - Score out of 10
    - Short explanation
    - Improvement suggestions

    Keep response professional.
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=1024
    )

    return completion.choices[0].message.content