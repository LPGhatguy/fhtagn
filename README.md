# fhtagn
**Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn.**

fhtagn is a free programming platform that is:
* Event-driven
* Pure functional
* Portable
* Expressive
* ~~Designed to summon Cthulhu~~

fhtagn provides this by providing a regular expression-only programming environment with no side-effects.

## Running
The reference implementation is in JavaScript, as it provides a decent regular expression implementation. It requires a browser with ES2015 support, like a recent version of Chrome, Firefox, Safari, or Microsoft Edge.

To run it, start a web server and open `index.html`. The preferred way to do this is with Python 2.x:

```sh
python -m SimpleHTTPServer 8000
```

Then, go to [localhost:8000](http://localhost:8000) to run the application. Output will be in the developer console of your browser.

## Writing
*Look at the `examples` directory for examples of various idiomatic constructs in fhtagn.*

fhtagn programs consist of alternating sequences of regular expressions and replacement patterns, separated by two backslashes (`\\`). Every cycle of the program runs each replacement in sequence, updating the program state.

Replacements are whitespace-trimmed, meaning that `^$ \\ \0 \\` is sugar for `^$\\\0\\`. Line breaks (or whitespace of any kind) is not required in fhtagn.

Non-printable ASCII characters can either be embedded directly in the source, or encoded as `\XXX`, where `XXX` is a number from 1 to 255. For example, `\32` is a space and `\0` is null.

When the program state begins with the null character (`\0`), the program is terminated and any characters after the null character are considered the result.

Here's fhtagn's version of "Hello, world":

```ruby
^$ \\ \0Cthulhu fhtagn! \\
```

A line beginning with `#` is considered a comment and is ignored. No whitespace is allowed before the character.

## Conventions
The first instruction of a fhtagn program sets up the initial state of the program. It maps `^$` to the initial program state.

Marker characters idiomatically progress in the order of `~`, `!`, `@`, `#`, `%`, `&`, and `=`. This matches the order of symbols on the top of a US keyboard while avoiding special symbols in regular expressions.

fhtagn source files have the extension `.fht`. For use in existing editors, set your syntax highlighting to Ruby for the best editing experience.