"use client"
import LinkButton from "@/components/LinkButton"
import Preview from "@/components/Preview"
import BeforeAndAfter from "@/components/BeforeAndAfter"
import Hero from "@/components/Hero"

export default function HomePage() {
    return (
        <div>
            <Hero />
            <section>
                {/* Value Proposition */}
                <h3>The simplest way to stay on track without thinking about staying on track.</h3>
                <p>Mosy productivity tools make you manage your system.</p>
                <p>ClearAgenda AI removes the system entirely from your attention.</p>
                <p>You speak. It Organizes. You Execute</p>
            </section>
            <section>
                {/* Pain Section */}
                <h3>Your current system is costing you more than time.</h3>
                <p>You probably already have:</p>
                <ul>
                    <li>A calendar you don't fully trust</li>
                    <li>A to-do list you avoid looking at</li>
                    <li>Tasks you keep rewriting instead of doing</li>
                    <li>A constant sense that you're behind, even thoughyou're not</li>
                </ul>
                <p>The problem isn't discipline.</p>
                <p>It's friction.</p>
                <p>Every small dicision - when should I do this? How long will it take? Where does it fit? - creates mental resistance.</p>
                <p>So things get postponed. Or forgotten. Or carried around in your head.</p>
            </section>
            <section>
                {/* Transition Section */}
                <h3>What if none of that was your job anymore?</h3>
                <p>ClearAgenda AI removes the planning layer entirely.</p>
                <p>You don't organize your life.</p>
                <p>You describe it.</p>
            </section>
            <Preview />
            <section>
                {/* Core Features */}
                <h3>Designed to remove mental load, not add features.</h3>
                <h4>Smart Scheduling</h4>
                <p>Your tasks are automatically placed into your calendar based on availability and priority - no manual fragging, sorting, or reorganizing.</p>
                <h4>Task Breakdown AI</h4>
                <p>Big, vague tasks become clear, actionable steps you can actually complete.</p>
                <h4>Daily Capacity Controls</h4>
                <p>Set how many hours you want to allocate per day of the week. ClearAgenda AI respects your energy and schedule.</p>
                <h4>Memory Bank</h4>
                <p>Everything you add is stored and tracked so nothing slips through the cracks - even long-term goals and low-priority reminders.</p>
                <h4>Always Current Plan</h4>
                <p>Your schedule continuously updates as life changes, so your plan stays realistic instead of becomming outdated.</p>
            </section>
            <BeforeAndAfter />
            <section>
                {/* Core Philosophy */}
                <h3>A calendar shouldn't require maintenance</h3>
                <p>Tranditional productivity tools assume you want to manage your life like a project.</p>
                <p>ClearAgenda AI assumes something different:</p>
                <p>You don't need more control.</p>
                <p>You need less friction.</p>
                <p>So instead of giving you more things to organize, it organizes them for you.</p>
            </section>
            <section>
                {/* Use Cases */}
                <h3>Built for real-life overwhelm</h3>
                <p>ClearAgenda AI is ideal for:</p>
                <ul>
                    <li>Developers juggling deep work and side projects</li>
                    <li>People rebuilding structure after burnout</li>
                    <li>Students balancing assignments and personal goals</li>
                    <li>Entrepreneurs managing chaotic, shifting prioritie</li>
                    <li>Anyone who keeps "starting over" with productivity systems</li>
                </ul>
            </section>
            <section>
                {/* Testimony */}
                <h3>What It Feels Like</h3>
                <p>"It's like waking up an already having a calm, realistic plan for the day."</p>
                <p>"I stopped re-organizing my tasks and actually started finishing them."</p>
                <p>"I didn't realise how much energy I was wasting just by deciding what to do next."</p>
            </section>
            <section>
                {/* Final CTA */}
                <h3>Stop planning. Start doing.</h3>
                <p>Your life doesn't need more organization tools.</p>
                <p>It needs clarity.</p>
                <p>ClearAgenda AI turns everything you need to do into a plan you can actually follow.</p>
                <LinkButton narrow href="/get-started" label="Get Started" />
            </section>
        </div>
    )
}