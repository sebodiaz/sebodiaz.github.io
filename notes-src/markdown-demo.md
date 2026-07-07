---
layout: note.njk
title: "Markdown Demo — Writing Notes in Markdown"
displayDate: "May 2026"
tags: ["example", "markdown"]
---

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
