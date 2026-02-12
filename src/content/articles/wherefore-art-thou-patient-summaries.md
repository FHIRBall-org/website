---
title: "Wherefore Art Thou Patient Summaries?"
description: "Clinician and citizen access to patient summaries is gaining a lot of attention in Canada and internationally. Numerous initiatives are under way in Canada."
pubDate: 2025-11-22
author: "Irfan Hakim"
tags: ["patient-summaries", "canada", "international-patient-summary"]
---

Clinician and citizen access to patient summaries is gaining a lot of attention in Canada and internationally. Numerous initiatives are under way in Canada -- some are in the early days of defining the business and technical vision for patient summary use, while others have systems in production to receive data and are moving on to enabling clinician and eventually citizen access.

The timing makes a lot of sense given the evolution of Canadian jurisdictional EHR efforts. Over the past 15 years, jurisdictions have been implementing the integration layers, registries (e.g., client, provider, etc.) and repositories (e.g., lab, medication, etc.) that addressed high value use cases and laid the foundation for their respective jurisdictional EHRs.

With many of these systems established, its understandable that jurisdictions would start to invest in patient summary initiatives which rely on these foundational EHR components.

There's just one problem; what the heck is a patient summary? Conceptually, the answer is relatively simple: A patient summary is a dataset of essential information about a patient that clinicians can use to provide care.

The challenges start when you attempt to unpack key words in that definition. For example, the "essential information" an EMT or ER clinician wants to see when providing unplanned care (i.e., emergency care) is a bit different then the information a specialist wants to see about a patient when receiving a referral. The good news is there are lots of standards development organizations (SDOs) that have drawn the Venn diagrams of these differing clinical needs to find the overlapping areas so they can define common data sets.

The best example of SDOs working together to establish a minimum data set is the International Patient Summary (IPS) FHIR implementation guide: [http://hl7.org/fhir/uv/ips/ipsStructure.html](http://hl7.org/fhir/uv/ips/ipsStructure.html)

The IPS is a collaborative effort among HL7, CEN, ISO, and IHE to define a key patient information snapshot. It is defined using a document paradigm (e.g., it has a subject, an author, etc.) plus a set of required sections every IPS implementation must have (e.g., medication summary, allergies and intolerances, problem list, etc.), as well as recommended and optional sections that provide additional information clinicians would want to know to support care.

Problem solved, right? Unfortunately, not. The IPS does a great job of describing "what" a patient summary is, but it doesn't describe "how" patient summaries are created or consumed. Not describing the "how" is intentional because of the many different ways in which patient summaries can be created and consumed. Let's look at three example design patterns.

## Pattern #1: One Ring to Rule Them All!

In this pattern, there is a single patient summary for a patient. It is created from data in a point of care system (e.g., a primary care EMR) and sent to a repository that clinicians in other organizations can access. The repository could be a jurisdictional data store or something as basic as a USB stick that a patient can take with them on holiday. The key point is there is one summary that contains all the clinically relevant data about the patient. But how can one clinician see all the clinically relevant data about a patient at any given point in time? What if a patient has multiple primary care docs and specialists? What if they are frequent flyers in emergency departments or walk in clinics? What about the medications or medical devices a patient receives while in hospital? Even if we could get all this data incorporated into the primary care EMR in our example, would the primary care clinician be accountable for it if it's included in the patient summary? Solving the challenges associated with creating a patient summary from a single clinician often leads people to the second design pattern...

## Pattern #2: Tell Me More, Tell Me More...

In this pattern there can be multiple "summaries". They could be visit summaries (i.e., a hospital discharge summary, a summary from every primary care clinician they patient has seen, etc.). Each summary is sent to a repository which other clinicians can query, retrieve a list of available "summaries", and then select the ones of interest. This approach has several challenges: it is not as helpful for EMTs and ER docs where every second counts in saving lives, the data in one summary can conflict with the data in another, etc. This is especially true given our health status constantly changes while these summaries are snapshots in time. For example, the IPS has a section for current medications. If a summary was created two years ago, can the receiving clinician trust that the listed medications are current? Solving these challenges often leads people to design pattern #3.

## Pattern #3: Run Forrest, Run! (AKA: Compiled at Run Time)

This pattern recognizes that no single provider has all of a patient's current data. Instead, this pattern takes advantage of the fact that jurisdictions have built EHRs that have data repositories that could be used to compile current data about a patient into a patient summary when a clinician requests it. Business rules could be applied to determine what is considered a current medication and which are the relevant lab test results to include in the patient summary. The patient summary created in this design pattern could arguably have the most clinical value, not only because of the breadth and currency of the data, but also because different views could be created to support different use cases. For example, an "unplanned care view" could only contain the medications and allergies that are relevant in an emergency situation, while a "continuity of care view" could pull in other medications and allergy data, along with data from the recommended and optional sections of the IPS.

The drawback of this approach? Complexity. It requires integration across numerous data sources, commitment from different parts of the health care sector to contribute data, and all the challenges associated with maintaining interfaces and business rules with feeder systems that are constantly evolving.

## Conclusion

The design patterns discussed above are not intended to be exhaustive nor mutually exclusive. Implementing design pattern #1 could be the first step on a longer journey towards developing the integrations and back-end systems required for design patterns #2 and #3.

While we can expect commonality at a conceptual level in jurisdictional patient summary solutions, variations will inevitably exist due to differences in the use case(s) the solutions are intended to support, the ability to extract data from source systems, and numerous other constraints. This means it is highly unlikely Canada will be able to achieve a common IPS FHIR implementation guide to support data extraction from source systems. However, it may be possible to have a common implementation guide for the systems consuming patient summaries.

The IPS FHIR implementation guide is a great starting point for anyone involved in patient summary initiatives. It does an excellent job of explaining what data should be in a patient summary to support unplanned care as well as providing recommendations on additional content that should be included in a patient summary to support other use cases.

In our next blog we'll explore the benefits and challenges of creating a Canadian IPS FHIR Implementation Guide. Stay tuned!
