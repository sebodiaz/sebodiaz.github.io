---
layout: note.njk
title: "DecoderCR"
date: 2026-07-02
displayDate: "July 7th, 2026"
tags: ["immunology", "ml", "biology"]
draft: true
---

Here, I go over [DecoderTCR: Compositional Pretraining and Entropy-Guided Decoding for TCR-pMHC Interactions](https://www.biorxiv.org/content/10.64898/2026.02.04.703820v1).


## Background

There are two immune systems in our body: **innate** and **adaptive**. Innate immunity responds fast, is non-specific, and swarms antigens. Adaptive immunity, by contrast, is slow, hyper-specific, and applies targeted pressure on the antigen.

The innate immune system swarms because it recognizes broad molecular patterns evolutionarily conserved across a class of pathogens (bacterial cell walls, unmethylated CpG DNA, viral RNA signatures). These are recognized by *hardcoded*, germline-encoded receptors, essentially a big lookup table. Fast, but blunt: it cannot tell one virus from another, and it cannot remember.

Adaptive immunity is precise, but that precision comes as a **matching problem**. To apply "targeted pressure on the antigen," you need a receptor that fits *this specific* threat and not the millions of harmless proteins your own body makes. However, a pathogen you have never seen could present essenetially *any* short protein fragment. How do we get around this? Well, the system generates one for any possible target.

### Solution: Manufacture Diversity, Then Select

The adaptive system's answer is brute force.

1. **Generate enormous receptor diversity randomly.** As each T cell matures, it assembles its T-cell receptor (TCR) by shuffling gene segments: pick a **V** segment, a **D**, and a **J** segment from a menu, then splice them together with random nucleotide insertions and deletions at the junctions. The result is a repertoire of more than $10^{10}$ distinct TCRs. The most variable region (where the segments meet) is the **CDR3**, the part that contacts the antigen.
2. **Select for usefulness after the fact.** The body generates a swarm of random TCRs; when one matches an antigen, that match triggers **clonal selection** and then **clonal expansion** (the matched T cell multiplies).

In short, adaptive immunity is a **generate-diverse-then-select** system.

### TCR Basics

A TCR never sees an intact pathogen. It can only see fragments *displayed by the body's own cells*, presented on **peptide–MHC complexes (pMHCs)** that coat the cell surface. Every cell continuously chops up a sample of its internal proteins, loads the resulting peptides onto **MHC** molecules, and holds them up at the surface like flashcards of what is inside it with self peptides on a healthy cell, viral peptides on an infected one.

Recognition is the event where a TCR engages one of these flashcards. Crucially, it is a **three-body interaction** where the TCR reads the peptide *and* the MHC scaffold holding it at the same time:

$$\text{recognition} = \text{TCR} + \text{peptide} + \text{MHC}.$$

This is why, as we will see, the model treats the MHC not as background scenery but as a first-class part of the object it has to reason about.

## DecoderTCR

### The data problem

The paper starts by emphasizing data asymmetry.

- **Repertoires are cheap to sequence.** Draw blood and read out the millions of TCRs a person is carrying. Abundant — but *unlabeled*: we see the receptors, not what they recognize.
- **What MHCs present is also cheap.** We can enumerate the peptides displayed by a given MHC. Abundant — but again one-sided.
- **The pairing is rare.** Confirming that *this* TCR recognizes *that* pMHC requires a wet-lab assay. The result is roughly **30k paired examples against ~1M unpaired ones.**

The key idea is to not attack the pairing head-on. Instead of learning the joint distribution directly, DecoderTCR first learns the **marginals** — it trains on $p(\text{peptide}, \text{MHC})$ and $p(\text{TCR})$ *separately*, exploiting the abundant unpaired data first, and only later spends the scarce paired data on what marginals alone cannot teach.

### The reframe: recognition as fill-in-the-blank

Before the training, the authors do a simple and effective trick. As opposed to building a bespoke "docking" network, DecoderTCR applies plain concatenation of the entire complex into a **single sequence**:

$$[\,\text{MHC} \parallel \text{peptide} \parallel \text{TCR}\alpha \parallel \text{TCR}\beta\,]$$

and trains a **masked language model** over it. This is the same fill-in-the-blank objective as BERT, but on amino acids. Simply: mask some residues, predict them from the rest.

This is the payload idea of the paper. Once the complex is one string, the question *"does this TCR bind this pMHC?"* turns into *"are these residues mutually consistent under the learned distribution?"* — and the model's ordinary bidirectional attention across the string **is** the interaction model. There is no separate module for how the chains talk to each other; cross-chain dependency is just attention between positions in the same sequence.

### The two-stage curriculum

The marginal-first strategy is implemented as a two-stage training curriculum:

1. **Stage 1 — learn each component's grammar.** Train on the abundant unpaired data: TCR repertoires on their own, and peptide–MHC pairs on their own. The model learns what a realistic CDR3 loop looks like and which peptides fit which MHC groove — but never sees a TCR and its target peptide together.
2. **Stage 2 — learn how the two halves constrain each other.** Continue training on the scarce paired data, now masking peptide *and* CDR3 positions jointly. To fill in a masked peptide the model must use the CDR3 in context, and vice versa. This cross-conditioning — *"given this CDR3, what peptide would it grip?"* — is the one thing only paired data can teach.

One extra detail worth keeping, because it is genuinely elegant: the masking is **informed**, not random. Instead of masking 15% of positions uniformly, the model spends its masking budget on the binding-relevant positions — the peptide, the CDR3 loops, and the MHC pocket residues. In effect: *make the model predict the parts that actually matter.*