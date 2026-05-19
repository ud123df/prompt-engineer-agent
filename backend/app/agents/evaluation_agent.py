from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.2
)

def evaluation_agent(state):

    optimized_prompt = state["optimized_prompt"]

    prompt = f"""
    Evaluate this prompt.

    Score:
    - clarity
    - specificity
    - reliability
    - hallucination risk

    Prompt:
    {optimized_prompt}
    """

    response = llm.invoke([
        HumanMessage(content=prompt)
    ])

    state["evaluation"] = response.content

    return state