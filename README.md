tiq
===

Tiq is a small command-line tool that allows adding meaning to any piece of
text by associating tags (typically shorter pieces of text) with it.

In practice, this is useful as a web bookmarking tool, but its use is not
limited to it.


Setup
-----
```
npm install -g tiq
```

This will make the `tiq` command available in your `$PATH`. But if you want to
install locally, omit the `-g` option and link `index.js` yourself.


Usage
-----

Here's how you add some tags to some text:

```
$ tiq "This too shall pass." quotes,inspiring
```

To use it as a bookmarking tool:

```
$ tiq http://duckduckgo.com/ url,search,awesome
$ tiq http://www.bing.com/ url,search,microsoft
$ tiq http://www.reddit.com/ url,timewaster,funny
```

Then, to recall stuff tagged with `search`:

```
$ tiq search
http://duckduckgo.com/
http://www.bing.com/
```

... or both `search` and `awesome`:
```
$ tiq search,awesome
http://duckduckgo.com/
```

You can change the separator with the `--separator` option:
```
$ tiq -s : search:awesome
http://duckduckgo.com/
```

You can also tag multiple things at once, by using the separator in the first
argument too:
```
$ tiq http://www.theverge.com/,http://www.engadget.com/ url,tech,news
```

There's no difference to which argument you use as text you want to tag and
which one you use for tags. That is, the following is equivalent to the above:
```
$ tiq url,tech,news http://www.theverge.com/,http://www.engadget.com/
```

You can optionally use a namespace to partition your data. For example:
```
$ tiq -n john url http://myprivateblog.com/
```

Now running `tiq -n john url` will return only things tagged with `url` under
the `john` namespace.


Storage
-------

Out of the box, tiq comes with support for persisting the data in a JSON file
using the [tiq-json](http://github.com/imiric/tiq-json) plugin.

Alternatively, you can use the following storage plugins:

- [tiq-db](https://github.com/imiric/tiq-db): store data in SQLite, PostgreSQL
  or MySQL.


Configuration
-------------

The configuration file by default is expected in `$XDG_CONFIG_HOME/tiq/config.json`
(where `$XDG_CONFIG_HOME` is `$HOME/.config`).

Here are the options you can set in the configuration file:

- `separator`: The separator used to split text items and tags. [default: `","`]
- `store.plugin`: The name of the storage plugin to use. [default: `"tiq-json"`]
- `store.config`: Additional configuration specific to the storage plugin. See
  each plugin's documentation for the format it expects. [default: `{}`]

You can override some of this configuration by specifying various options at
runtime. See `tiq --help` for more information.


License
-------

[MIT](LICENSE)
