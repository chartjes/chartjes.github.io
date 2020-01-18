---
layout: post
title: "Letting Emacs into your grumpy heart"
author: Chris Hartjes
date: 2017-05-26
comments: true
sharing: true
---
Yes, the rumours are true. Your grumpy blogger, a long-time and generally
satisfied [Vim](https://vim.org) user has decided to embrace some fear,
turn on [EVIL mode](https://www.emacswiki.org/emacs/Evil) and give Emacs
a fair evaluation.

To be truthful, I had used Emacs before. Back in 2002 I was using Linux as
my working environment and used it because the guy sitting next to me
(hi Kemo, wherever you are!) was using it and showed me the basics. All I
retained over the years was C-x C-f to load files and C-x C-c to quit.

Over the years I tried all sorts of editors -- [Eclipse](https://www.eclipse.org/),
[JEdit](http://jedit.org/), [TextMate](https://macromates.com/), [Sublime Text](https://www.sublimetext.com/) --
before finally settling on Vim and builidng the request muscle memory along
with the proper superior attitude.

I also have used [PyCharm](https://www.jetbrains.com/pycharm/) and [PhpStorm](https://www.jetbrains.com/phpstorm/)
because sometimes you need an IDE to help you when you are learning new languages
beyond the beginner stage or dealing with a [really complicated code base you let spin out of control](https://github.com/opencfp/opencfp).
Right tool for the right job is a real thing, not just advice that developers
who are bitter you don't like the tool they think is "right" give.

Vim is a great modal editor -- really powerful, and has a ridiculous amount
of plugins that can extend Vim to make it even more useful. I've been able
to get quite productive with it. At the same time, I can also get frustrated
with how some stuff seemed really hard to get just right with plugins and
how weird [Vimscript](http://learnvimscriptthehardway.stevelosh.com/) is.

All the while I would see Emacs stuff bubble up to the surface on Twitter or
YouTube would recommend that I watch a video about it. I came to realize that
Emacs is very powerful and can do pretty much everything that Vim can do.
Plus there is EVIL mode, which allows me to use Emacs with all the HJKL goodness
I have come to expect from Vim.

I thought it might be constructive for me to go over my .emacs file as it
currently stands and explain my choices. Honestly, it hasn't been that hard a
transition using Emacs at this point. Retraining my brain to remember new
key combinations is the harder part.

```
;;; Code:
(package-initialize)

(setq package-archives '(("gnu" . "http://elpa.gnu.org/packages/")
                         ("marmalade" . "https://marmalade-repo.org/packages/")
			 ("melpa-stable" . "https://stable.melpa.org/packages/")
                       ("melpa" . "http://melpa.org/packages/")))
```

All I am gonna say here is that Emacs packaging is interesting.

```
;;; EVIL mode to help me transition from Vim to Emacs
(require 'evil)
(evil-mode 1)
```

EVIL mode is a really good Vim emulation mode for Emacs. It allows me to
use most of the keystrokes I am comfortable with to move around within
Emacs buffers.

```
;;; Some general settings
(setq make-backup-files nil)
(define-coding-system-alias 'UTF-8 'utf-8)
(setq inhibit-startup-message t)
(set-language-environment 'utf-8)
(set-default-coding-systems 'utf-8)
(set-selection-coding-system 'utf-8)
(set-locale-environment "en.UTF-8")
(prefer-coding-system 'utf-8)
```

I took these from Some Random Person's Emacs Settings. Mostly it's to make
sure we do everything in UTF-8 and to not have my filesystem littered with
all sorts of back-up files.

```
;;; Set up autocomplete
(require 'auto-complete-config)
(setq-default ac-sources (add-to-list 'ac-sources 'ac-source-dictionary))
(ac-config-default)
(global-auto-complete-mode t)
```

Autocompletition that works! Before you get all mad, I have used autocompletion
in Vim for a long time but sometimes it wouldn't quite work properly. I have found
Emacs autocomplete to be programming language sensitive, something I did not notice happening
in Vim.

```
;;; YaSnippet
(yas-global-mode 1)
```

[YASnippet](https://www.emacswiki.org/emacs/Yasnippet) is an Emacs mode that allows
you to create language-specific templates to allow you to quickly generate code for
things like for loops or if-then statements.

```
;;; PHP settings
(require 'php-mode)
(require 'php-auto-yasnippets)
(define-key php-mode-map (kbd "C-c C-y") 'yas/create-php-snippet)
(payas/ac-setup)
(setq php-auto-yasnippet-php-program "/Users/chartjes/.emacs.d/Create-PHP-YASnippet.php")
```

Still gotta do PHP work despite all my Python QA work! The PHP mode is pretty solid,
and I like being able to generate snippets for my work. Remember kids, we only have so
many keystrokes in our fingers.

```
;;; Some file mappings
(add-to-list 'auto-mode-alist '("\\.md\\'" . markdown-mode))
(add-to-list 'auto-mode-alist '("\\.py\\'" . python-mode))
```

Just telling Emacs what file endings map to what languages. Some programming-language
modes can figure this out, Emacs wanted me to be specific about Markdown and Python

```
;;; Modeline
(defvar sml/theme)
(setq sml/theme 'powerline)
(sml/setup)
```

If you're a Vim user who liked [a cool status line](https://github.com/Lokaltog/vim-powerline)?
Check out [smart-mode-line](https://github.com/Malabarba/smart-mode-line/)

```
;;; Flycheck
(require 'flycheck)
(global-flycheck-mode t)
(setq flycheck-phpcs-standard "psr2")
(add-to-list 'flycheck-disabled-checkers 'python-pylint)
(add-hook 'python-mode-hook #'flycheck-mode)
(add-hook 'python-mode-hook
	  (lambda () (flycheck-select-checker 'python-flake8)))
(require 'flycheck-color-mode-line)
(eval-after-load "flycheck"
  '(add-hook 'flycheck-mode-hook 'flycheck-color-mode-line-mode))
```

[Flycheck](https://github.com/flycheck/flycheck) will do on-the-fly syntax checking
of your code. Just hook into the proper modes and you'll be good to go. Works great
with PHP code too.

```
;;; JEDI autocompletion for Python
(add-hook 'python-mode-hook 'jedi:setup)
(defvar jedi:complete-on-dot)
(setq jedi:complete-on-dot t)
```

[JEDI](https://github.com/davidhalter/jedi) is a cool tool for doing Python-specific
static analysis and syntax checking for your Python code. Highly recommend it.

```
;;; Mageit for Git
(require 'magit)
(global-set-key (kbd "C-x g") 'magit-status)
```

The only Emacs mode you will ever need to do work with Git

```
;;; Elm-specific settings
(require 'elm-mode)
```

Maybe one day I can do Elm for money.

```
;;; We will also need web mode stuff
(require 'web-mode)
(setq web-mode-ac-sources-alist
  '(("php" . (ac-source-yasnippet ac-source-php-auto-yasnippets))
    ("html" . (ac-source-emmet-html-aliases ac-source-emmet-html-snippets))
    ("css" . (ac-source-css-property ac-source-emmet-css-snippets))))
(add-hook 'web-mode-before-auto-complete-hooks
          '(lambda ()
             (let ((web-mode-cur-language
                    (web-mode-language-at-pos)))
               (if (string= web-mode-cur-language "php")
                   (yas-activate-extra-mode 'php-mode)
                 (yas-deactivate-extra-mode 'php-mode))
               (if (string= web-mode-cur-language "css")
                   (setq emmet-use-css-transform t)
                 (setq emmet-use-css-transform nil)))))
```

[Web mode](http://web-mode.org/) is intended to make working with web-centric
languages easier in that it can recoginze when you have HTML and CSS code
mixed in with your scripting language of choice, applying different syntax
highlighting and styling rules to them. Really neat stuff

```
;;; Python settings
(require 'virtualenvwrapper)
(venv-initialize-interactive-shells)
(setq venv-location '("/Users/chartjes/Kinto/kinto-integration-tests/venv-kit"))
```

Did I mention that you can make Emacs aware of virtual Python environments?

```
;;; Settings for Corral (surrounding text with stuff)
(global-set-key (kbd "M-9") 'corral-parentheses-backward)
(global-set-key (kbd "M-0") 'corral-parentheses-forward)
(global-set-key (kbd "M-[") 'corral-brackets-backward)
(global-set-key (kbd "M-]") 'corral-brackets-forward)
(global-set-key (kbd "M-{") 'corral-braces-backward)
(global-set-key (kbd "M-}") 'corral-braces-forward)
(global-set-key (kbd "M-\"") 'corral-double-quotes-forward)
```

I have relied heavily on [surround.vim](https://github.com/tpope/vim-surround) in the past,
[Corral](https://github.com/nivekuil/corral) seems to be a great solution to do the same thing in Emacs.

So there you have it! My early experiences with Emacs are good, I am slowly learning
new keystrokes to do new things and trying to get Emacs to intelligently help me be
a better developer.
