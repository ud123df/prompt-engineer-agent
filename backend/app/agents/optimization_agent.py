from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

llm = ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature = 0.4
)

def optimization_agent(state):
    structure_prompt = state["structured_prompt"]

    prompt = f"""
    Optimize this Ai prompt for:
    - clarity
    - token efficiency
    - output quality
    - hallucination reduction 
    Prompt:
    {structure_prompt}
"""
    
    response = llm.invoke([
        HumanMessage(content=prompt)
    ])

    state['optimized_prompt'] = response.content
    return state