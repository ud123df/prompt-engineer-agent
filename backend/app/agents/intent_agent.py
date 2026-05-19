from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

llm =  ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature = 0.3
)

def intent_agent(state):
    task = state["task"]

    prompt = f"""

    Analyze the user's intent.

    Identify:
    - domain
    - task type
    - desired outcome
    - target audience

    User Input:
    {task}
    """

    response = llm.invoke([
        HumanMessage(content=prompt)
    ])
    state["intent"] = response.content
    return state