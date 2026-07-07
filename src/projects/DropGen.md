---
layout: project.njk
title: "Why Invariance Alone is Not Enough for Medical Domain Generalization (and How to Fix It)"
date: 2026-04-02
venue: "In Review"
authors: "<strong>Sebo Diaz</strong><sup>1</sup>, Polina Golland<sup>1</sup>, Elfar Adalsteinsson<sup>1</sup>, Neel Dey<sup>2,3</sup>"
affiliations: "<sup>1</sup>MIT &nbsp;&middot;&nbsp; <sup>2</sup>Harvard Medical School &nbsp;&middot;&nbsp; <sup>3</sup>Massachusetts General Hospital"
links:
  - { text: "arXiv", url: "https://arxiv.org/abs/2604.02564" }
  - { text: "GitHub", url: "https://github.com/sebodiaz/DropGen" }
hero: "/images/publications/invariant_sebo_review.png"
heroAlt: "DropGen teaser figure"
heroCaption: "<strong>Figure 1.</strong> (Left) DropGen code overview. (Right) Probabilistic graphical model motivating our approach."
thumb: "/images/publications/invariant_sebo_review.png"
description: "DropGen: a simple, theoretically-grounded approach for domain generalization in 3D biomedical image segmentation."
---

## Abstract

We present **DropGen**, a simple and theoretically-grounded approach for domain generalization in 3D biomedical image segmentation. Modern segmentation models degrade sharply under shifts in modality, disease severity, clinical sites, and other factors, creating brittle models that limit reliable deployment. Existing domain generalization methods rely on extreme augmentations, mixing domain statistics, or architectural redesigns, yet incur significant implementation overhead and yield inconsistent performance across biomedical settings. **DropGen** instead proposes a principled learning strategy with minimal overhead that leverages both source-domain image intensities and domain-stable foundation model representations to train robust segmentation models. As a result, **DropGen** achieves strong gains in both fully supervised and few-shot segmentation across a broad range of shifts in biomedical studies. Unlike prior approaches, **DropGen** is architecture- and loss-agnostic, compatible with standard augmentation pipelines, computationally lightweight, and tackles arbitrary anatomical regions. Our implementation is publicly available.

## Method

<div class="placeholder">Method figure / overview coming soon.</div>

## Results

<div class="placeholder">Quantitative results table coming soon.</div>

<div class="placeholder">Qualitative comparisons coming soon.</div>

## BibTeX

```bibtex
@article{diaz2025DropGen,
  title     = {Why Invariance Alone is Not Enough for Medical Domain
               Generalization (and How to Fix It)},
  author    = {Diaz, Sebastian and Golland, Polina and
               Adalsteinsson, Elfar and Dey, Neel},
  journal   = {arXiv},
  year      = {2025}
}
```
