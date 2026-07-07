---
layout: note.njk
title: "Self-Distillation Summary"
displayDate: "May 5th, 2026"
tags: ["distillation", "rl", "generalization"]
---

Recently, I have been reading a lot of work in self-distillation policy optimization (SDPO), a dense-credit objective that distills the knowledge of a _privileged_ teacher into the student. As given by its namesake, the teacher is the student with the only caveat that it is provided _additional_ information. The job of the teacher is to effectively "guide" the student towards completing a task.

## Formal setup
Let \( \pi_{\theta} \) be a language model with parameters \( \theta \), defining a distriution over next tokens \( \pi_{\theta}(x_t \mid x_{\lt t}) \). In OPSD, the _teacher_ is the same model conditioned on _privileged_ information, or context, \( c \). For example, ground-truth solutions traces (SDPO with rich feedback), explicit error feedback (SDPO with rich environment feedback), or additional hints/instructions.

Define the per-position student and teacher distributions:

\[
p_{t}^{S} = \pi_{\theta}(\cdot \mid x_{\lt t}), \quad p_{t}^{T} = \pi_{\theta}(\cdot \mid x_{\lt t}, c)
\]

The student weights are updated to minimize the KL-based distillation loss. I focus on the SDPO formulation, which interpolates between the forward and reverse KL via a coefficient \( \alpha \) (`alpha` in their codebase, where \(\alpha = 0\), is forward KL, \(\alpha = 1\) is reverse KL, and \(\alpha = 0.5\) is JSD):
\[
\mathcal{L}_{SDPO} = \mathbb{E}_{t} \big[ (1 - \alpha) \cdot D_{KL}(p^{T}_{t} || p_{t}^{S}) + \alpha \cdot D_{KL}(p^{S}_{t} || p_{t}^{T}) \big]
\]

The teacher distribution is held approximately fixed during a step (via EMA or trust-region regularization in practice). Based on \( \mathcal{L}(\theta) \) above, we can see that there is a _reverse_ and _forward_ KL term. The _forward_ KL is **mass-covering** and forces the student to maintain mass everywhere the teacher does. The _reverse_ KL is **mode-seeking** and penalizes the student for placing the mass where the teacher has none, but does _not_ penalize the student for placing no mass where the teacher has placed.

By default, SDPO uses \( \alpha = 0.5 \) (JSD). Empirically, the dominant compressive force comes from the reverse-KL component: the student concentrates mass on continuations the teacher prefers under the privileged context, abandoning continuations the unconditioned student previously hedged between.

We can demonstrate these repressive forces with standard plots.

```python
# libraries
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# grid
x = np.linspace(-6, 6, 1000)

def p_teacher(x):
  """ teacher: mixture of two gaussians """
  return 0.5*norm.pdf(x, -2, 0.8) + 0.5*norm.pdf(x, 2, 0.8)

def p_student(x, mu):
  """ student: single gaussian """
  return norm.pdf(x, mu, 1.0)

# KL computations (numerical)
def kl_ps_pt(mu):
    ps = p_student(x, mu)
    pt = p_teacher(x)
    eps = 1e-10
    return np.sum(ps * (np.log(ps + eps) - np.log(pt + eps))) * (x[1] - x[0])

def kl_pt_ps(mu):
    ps = p_student(x, mu)
    pt = p_teacher(x)
    eps = 1e-10
    return np.sum(pt * (np.log(pt + eps) - np.log(ps + eps))) * (x[1] - x[0])

# Sweep over means
mus = np.linspace(-4, 4, 200)
reverse_kl = [kl_ps_pt(mu) for mu in mus]
forward_kl = [kl_pt_ps(mu) for mu in mus]

# Plot KL curves
plt.figure(figsize=(10, 4))
plt.plot(mus, reverse_kl, label="Reverse KL: KL(pS || pT)")
plt.plot(mus, forward_kl, label="Forward KL: KL(pT || pS)")
plt.legend()
plt.xlabel("Student mean (mu)")
plt.ylabel("KL divergence")
plt.title("Forward vs Reverse KL behavior")
plt.show()
```

Based on this intuiton, we can define a **prunability** score at position \( t \):
\[
\rho_{t} = H(p_{t}^{S}) \cdot D_{KL}(p_{t}^{T} || p_{t}^{S})
\]
Positions where the student is confident (low entropy) have little redundant mass to reallocate, so they are not prunable. Positions where the student already matches the teacher (low forward KL) also survive. High prunability arises only where the student is both uncertain (high entropy) and fails to cover teacher-supported outcomes (high forward KL), indicating compressible structure.

## Connection to Mutual Information
Independently, recent work (_Demystifying Reasoning Dynamics with Mutual Information 2025_) identifies **information peaks** in reasoning trajectories. These are positions where token-level mutual information with the final answer spikes. These positions are dominated by discourse markers ("So", "Hmm", "Wait"). Suppressing them degrades reasoning: suppressing random non-peak tokens does not.

While mutual information and prunability capture distinct properties—predictiveness of the final answer versus local uncertainty and mismatch—they may overlap in regimes where critical reasoning steps are also unstable for the student. In such cases, self-distillation may preferentially compress parts of the trajectory that are disproportionately important for accurate reasoning. This provides a potential mechanism for why distillation shortens reasoning traces and can degrade out-of-distribution generalization: it removes or smooths tokens that, while not always locally stable, play an outsized role in structuring the computation leading to the final answer.

<div class="callout hypothesis">
<div class="callout-label">Hypothesis</div>
We hypothesize that tokens with high mutual information and high prunability—i.e., tokens that are both globally predictive of the answer and locally unstable under the student—form a small but critical subset of reasoning steps. These tokens are disproportionately affected by self-distillation, leading to compressed but less robust reasoning trajectories.
</div>


TMEP asda This note is the Markdown counterpart to the LaTeX demo. Copy this file as a starting point for any new note. Math is rendered via [MathJax v3](https://www.mathjax.org/), so standard LaTeX works inside.

A note on math delimiters: prefer `\(...\)` for inline and `\[...\]` for display, since Markdown's `_` and `*` can collide with subscripts/multiplication inside `$...$`. Both work, but the backslash forms are safer.

## 1. Inline and Display Math

Inline: the Gaussian distribution is \(p(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}\). Custom macros work too: the norm \(\norm{v}\) and the inner product \(\inner{u}{v}\).

Display mode centers the equation:

\[
  \mathcal{L}(\theta) = -\sum_{i=1}^{N} \log p_\theta(x_i)
\]

## 2. Numbered & Labeled Equations

Equations auto-number when you use `\begin{equation}`:

\begin{equation}
\label{eq:bayes}
p(\theta \mid x) = \frac{p(x \mid \theta)\, p(\theta)}{p(x)}
\end{equation}

Bayes' theorem \eqref{eq:bayes} is the foundation of probabilistic inference.

## 3. Aligned Systems

\begin{align}
\nabla_\theta \mathcal{L}
  &= -\sum_{i=1}^{N} \nabla_\theta \log p_\theta(x_i) \\
  &= -\sum_{i=1}^{N} \frac{\nabla_\theta p_\theta(x_i)}{p_\theta(x_i)} \\
  &= -N\, \E_{x \sim p_\theta}\!\left[\nabla_\theta \log p_\theta(x)\right].
\end{align}

## 4. Matrices

\[
  A = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix},
  \qquad
  \det(A) = a_{11}a_{22} - a_{12}a_{21}.
\]

## 5. Callout Boxes

Callouts are plain HTML — Markdown lets you mix raw HTML freely:

<div class="callout definition">
<div class="callout-label">Definition</div>
A function \(f: \R^n \to \R\) is <em>convex</em> if for all \(x, y \in \R^n\) and \(\lambda \in [0,1]\),
\[
  f(\lambda x + (1-\lambda)y) \leq \lambda f(x) + (1-\lambda)f(y).
\]
</div>

<div class="callout theorem">
<div class="callout-label">Theorem (Jensen's Inequality)</div>
If \(f\) is convex and \(X\) is a random variable, then \(f(\E[X]) \leq \E[f(X)]\).
</div>

<div class="callout remark">
<div class="callout-label">Remark</div>
Equality holds iff \(X\) is constant a.s. or \(f\) is affine.
</div>

<div class="callout warning">
<div class="callout-label">Warning</div>
Do not confuse the <em>empirical</em> risk \(\hat{\mathcal{L}}_N\) with the <em>population</em> risk \(\mathcal{L}\); the gap matters when \(N\) is small.
</div>

## 6. Code Blocks

Fenced code blocks pick up syntax highlighting from highlight.js:

```python
import numpy as np

def gradient_descent(f_grad, x0, lr=1e-3, steps=1000):
    """Vanilla gradient descent."""
    x = x0.copy()
    for _ in range(steps):
        x -= lr * f_grad(x)
    return x
```

```python
mu = np.zeros(2)
Sigma = np.array([[1.0, 0.8],
                  [0.8, 1.0]])
samples = np.random.multivariate_normal(mu, Sigma, size=1000)
```

## 7. Lists and Inline Code

Available macros (defined in the layout's MathJax config):

- `\R` → \(\R\) (reals)
- `\E` → \(\E\) (expectation)
- `\norm{v}` → \(\norm{v}\)
- `\abs{x}` → \(\abs{x}\)
- `\inner{u}{v}` → \(\inner{u}{v}\)

---

To add a new note: drop a `.md` file into `notes-src/` with frontmatter (`layout`, `title`, `date`, `tags`), run `npm run build`, and add a card in [notes/index.html](../).
