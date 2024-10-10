import Agent1 from './agents/Agent1'
import Agent2 from './agents/Agent2'
import Agent3 from './agents/Agent3'
import AgentSection from './agents/AgentSection'

export default function AgentSubSection() {
  return (
    <section>
      <h2 className="section-heading">For Agents</h2>
      <AgentSection />
      <Agent1 />
      <Agent2 />
      <Agent3 />
    </section>
  )
}
