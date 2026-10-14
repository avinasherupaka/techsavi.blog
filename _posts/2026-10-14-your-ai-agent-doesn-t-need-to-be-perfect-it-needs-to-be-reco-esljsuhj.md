---
layout: post
title: "Your AI Agent Doesn't Need to Be Perfect. It Needs to Be Reconstructable"
img: ml-future.png
tags: [AI, Governance, Security, Data, Technology]
author: Avinash Erupaka
---

## The Perspective

Most conversations about AI agents start with accuracy. Is the agent right often enough to trust? That is a fair question, but in regulated environments it is only half of the question. The other half is whether you can explain why the agent acted the way it did.

My view is simple: accuracy is a metric, but traceability is a control. Only one of them helps when a reviewer asks what happened on a Tuesday three months ago.

## The question auditors actually ask

A model can perform well on a test set and still be indefensible in production. If nobody can show how a specific output came about, a strong benchmark score doesn't help much.

In a regulated setting, the question is rarely "was it right?" on its own. It is "what happened, who authorized it, and can you show me?" An agent that is right 98 times out of 100 but cannot account for the other two has a governance problem, not just an accuracy problem.

This is the shift I think technology leaders need to make. We are moving from validating a fixed system to governing a system that makes choices.

## What manufacturing quality systems already figured out

A useful comparison is the batch record in manufacturing. A batch record doesn't promise that nothing will go wrong. It lets you reconstruct what was done, with which materials, and who signed off. Quality systems rest on proving control, not perfection.

That discipline maps well onto agents. Every agent task should have a recorded intent, a captured context, and a documented approval wherever the consequences warrant one.

The analogy also breaks, and the break matters. A batch process is designed to be largely deterministic. An agent can take a different path on the same input. So a record of inputs and outputs is not enough. You need the path the agent actually took: the tool calls it made, the context it retrieved, and the versions of the prompt and model in play at that moment.

This is the part I'd flag to anyone borrowing compliance patterns from older systems. The pattern transfers, but the unit of record changes from the result to the route.

## Four controls to put in place before you scale

If I were setting priorities, I would build the evidence trail before expanding an agent's scope. Four controls come first:

- **Recorded intent.** What task was the agent given, and by whom?
- **Captured context.** Which data, tools, and prompt versions did it use at decision time?
- **Bounded authority.** What may it do without a human, and what must it escalate?
- **Human checkpoints.** Where does a named person review or approve before an action has consequences?

Bounded authority is the design lever I'd lean on most. It works like least-privilege access in security: give the agent the narrowest permissions that still let it do useful work, and route anything with material impact through a person.

A narrow, well-described action space also makes validation tractable. It is far easier to test and document than an open-ended one.

A simple authority matrix makes this concrete:

| Action class | Agent behavior | Evidence required |
|---|---|---|
| Low-risk, reversible | Acts alone | Logged intent, context snapshot, action trace |
| Moderate impact | Acts after review | Same, plus reviewer identity |
| High-impact or irreversible | Proposes only | Same, plus explicit named approval |
| Out of scope | Never acts | Refusal logged |

## Checkpoints that are designed, not bolted on

An approval step that the reviewer cannot meaningfully inspect is theater. If a person is asked to approve an action, show them the intent, the evidence used, and the proposed action in one view. Otherwise the checkpoint exists on paper and nowhere else.

## Why this speeds teams up

The common assumption is that governance slows delivery. I think the opposite is true when controls are built in early. Reviewers who can inspect a trace tend to say yes faster than reviewers who have to take your word for it.

The practical payoff is faster review cycles, fewer pilots stalled in quality and compliance review, and a credible answer when governance asks the hard questions. This is an opinion about how these programs tend to go, not a measured result from any particular implementation.

It is also vendor-neutral. Any orchestration layer, model provider, or data platform can emit the needed traces if the requirement is set at design time. The hard part is deciding the logging and approval design first, not choosing a tool.

## A replay drill you can run this month

The cheapest way to test all of this is a replay drill. Pick one past agent decision and try to reconstruct it: the intent, the context, the versions, the tool calls, and the approver. Time how long it takes, and write down what is missing.

The gaps you find are your real backlog. They are more useful than another accuracy benchmark.

## What I'd do next

1. **Define an action-authority matrix** that lists what the agent may do alone, with review, or never.
2. **Log the decision path**, including intent, context snapshot, prompt and model version, tool calls, and approver identity.
3. **Run the replay drill** on one real decision and fix what it exposes before widening the agent's scope.

If an auditor asked you to replay one agent decision from last quarter, how long would it take, and what would be missing? If you can't answer confidently, that is the first thing to fix, ahead of the next capability.
