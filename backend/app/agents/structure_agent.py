from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

llm = ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature = 0.5
)

def structure_agent(state):

    task = state["task"]
    intent = state["intent"]

    prompt = f"""
    Create a professionally structured Ai prompt.

    Intent Analysis:
    {intent}
    
    Original Task:
    {task}

    Add:
    - role
    - instruction
    - constraints
    - output format
    """

    response = llm.invoke([
        HumanMessage(content=prompt)
    ])

    state["structured_prompt"] = response.content

    return state