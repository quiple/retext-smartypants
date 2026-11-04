import assert from 'node:assert/strict'
import test from 'node:test'
import {retext} from 'retext'
import retextSmartypants from 'retext-smartypants'

test('retextSmartypants', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('retext-smartypants')).sort(), [
      'default'
    ])
  })
})

test('Curly quotes', async function (t) {
  const processor = retext().use(retextSmartypants)

  await t.test('should not throw when not omitted', async function () {
    assert.doesNotThrow(async function () {
      retext().use(retextSmartypants, {quotes: false}).freeze()
    })
  })

  await t.test('should curl double quotes', async function () {
    assert.equal(
      processor.processSync('Alfred "bertrand" cees.').toString(),
      'Alfred “bertrand” cees.'
    )
  })

  await t.test('should curl single quotes', async function () {
    assert.equal(
      processor.processSync("Alfred 'bertrand' cees.").toString(),
      'Alfred ‘bertrand’ cees.'
    )
  })

  await t.test('should curl initial double quotes', async function () {
    assert.equal(
      processor.processSync('"Alfred" bertrand.').toString(),
      '“Alfred” bertrand.'
    )
  })

  await t.test('should curl initial single quotes', async function () {
    assert.equal(
      processor.processSync("'Alfred' bertrand.").toString(),
      '‘Alfred’ bertrand.'
    )
  })

  await t.test('should curl final double quotes', async function () {
    assert.equal(
      processor.processSync('Alfred "bertrand".').toString(),
      'Alfred “bertrand”.'
    )
  })

  await t.test('should curl final single quotes', async function () {
    assert.equal(
      processor.processSync("Alfred 'bertrand'.").toString(),
      'Alfred ‘bertrand’.'
    )
  })

  await t.test('should curl single quotes in double quotes', async function () {
    assert.equal(
      processor.processSync('"\'Alfred\' bertrand" cees.').toString(),
      '“‘Alfred’ bertrand” cees.'
    )

    assert.equal(
      processor.processSync('"Alfred \'bertrand\'" cees.').toString(),
      '“Alfred ‘bertrand’” cees.'
    )
  })

  await t.test('should curl double quotes in single quotes', async function () {
    assert.equal(
      processor.processSync('\'"Alfred" bertrand\' cees.').toString(),
      '‘“Alfred” bertrand’ cees.'
    )

    assert.equal(
      processor.processSync('\'Alfred "bertrand"\' cees.').toString(),
      '‘Alfred “bertrand”’ cees.'
    )
  })

  await t.test('should curl nested double quotes', async function () {
    assert.equal(
      processor.processSync('"Alfred "bertrand" cees."').toString(),
      '“Alfred “bertrand” cees.”'
    )
  })

  await t.test('should curl nested single quotes', async function () {
    assert.equal(
      processor.processSync("'Alfred 'bertrand' cees.'").toString(),
      '‘Alfred ‘bertrand’ cees.’'
    )
  })

  await t.test(
    'should curl initial double quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync('Alfred ".bertrand" cees.').toString(),
        'Alfred “.bertrand” cees.'
      )
    }
  )

  await t.test(
    'should curl initial single quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync("Alfred '.bertrand' cees.").toString(),
        'Alfred ‘.bertrand’ cees.'
      )
    }
  )

  await t.test(
    'should curl initial double quotes when preceded by a full stop',
    async function () {
      assert.equal(
        processor.processSync('Alfred "bertrand." cees.').toString(),
        'Alfred “bertrand.” cees.'
      )
    }
  )

  await t.test(
    'should curl initial single quotes when preceded by a full stop',
    async function () {
      assert.equal(
        processor.processSync("Alfred 'bertrand.' cees.").toString(),
        'Alfred ‘bertrand.’ cees.'
      )
    }
  )

  await t.test(
    'should curl initial double quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync('"..Alfred"').toString(), '“..Alfred”')
    }
  )

  await t.test(
    'should curl initial single quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync("'..Alfred'").toString(), '‘..Alfred’')
    }
  )

  await t.test(
    'should curl final double quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync('"Alfred"..').toString(), '“Alfred”..')
    }
  )

  await t.test(
    'should curl final single quotes when followed by a multiple ' +
      'full-stops',
    async function () {
      assert.equal(processor.processSync("'Alfred'..").toString(), '‘Alfred’..')
    }
  )

  await t.test(
    'should curl final double quotes when followed by a comma',
    async function () {
      assert.equal(
        processor.processSync('"Alfred", bertrand.').toString(),
        '“Alfred”, bertrand.'
      )
    }
  )

  await t.test(
    'should curl final single quotes when followed by a comma',
    async function () {
      assert.equal(
        processor.processSync("'Alfred', bertrand.").toString(),
        '‘Alfred’, bertrand.'
      )
    }
  )

  await t.test('should curl apostrophes when followed `s`', async function () {
    assert.equal(
      processor.processSync("Alfred's bertrand.").toString(),
      'Alfred’s bertrand.'
    )
  })

  await t.test(
    'should curl leading elisions as apostrophes',
    async function () {
      for (const word of [
        'bout',
        'cause',
        'cept',
        'cos',
        'coz',
        'cross',
        'cuz',
        'em',
        'fore',
        'gainst',
        'long',
        'mid',
        'midst',
        'mong',
        'mongst',
        'neath',
        'nother',
        'nuff',
        'pon',
        'round',
        'til',
        'tis',
        'twas',
        'tween',
        'twere',
        'twill',
        'twixt',
        'twould'
      ]) {
        assert.equal(processor.processSync("'" + word).toString(), '’' + word)
        assert.equal(
          processor.processSync("'" + word + "'").toString(),
          '‘' + word + '’'
        )
      }

      assert.equal(
        processor.processSync("'Twasn't easy.").toString(),
        '’Twasn’t easy.'
      )
      assert.equal(
        processor.processSync("'twouldn’t work.").toString(),
        '’twouldn’t work.'
      )
      assert.equal(
        processor.processSync("'Cause I told 'em 'bout it.").toString(),
        '’Cause I told ’em ’bout it.'
      )
      assert.equal(
        processor.processSync('"\'cause it rained"').toString(),
        '“’cause it rained”'
      )
      assert.equal(
        processor.processSync("I told 'em, 'cause it rained.").toString(),
        'I told ’em, ’cause it rained.'
      )
    }
  )

  await t.test(
    'should preserve quotes around elision words',
    async function () {
      assert.equal(processor.processSync("'cause'").toString(), '‘cause’')
      assert.equal(
        processor.processSync("'cause and effect'").toString(),
        '‘cause and effect’'
      )
      assert.equal(
        processor.processSync('"\'cause and effect\'"').toString(),
        '“‘cause and effect’”'
      )
      assert.equal(processor.processSync("'causes").toString(), '‘causes')
      assert.equal(
        processor.processSync("'roundabout").toString(),
        '‘roundabout'
      )
      assert.equal(processor.processSync("'twasn't'").toString(), '‘twasn’t’')
      assert.equal(processor.processSync("'cause’").toString(), '‘cause’')
    }
  )

  await t.test('should respect quote options for elisions', async function () {
    assert.equal(
      retext()
        .use(retextSmartypants, {
          closingQuotes: {double: '»', single: '›'},
          openingQuotes: {double: '«', single: '‹'}
        })
        .processSync("'cause")
        .toString(),
      '›cause'
    )
    assert.equal(
      retext()
        .use(retextSmartypants, {quotes: false})
        .processSync("'cause")
        .toString(),
      "'cause"
    )
  })

  await t.test(
    'should reconsider later elisions after a closing quote',
    async function () {
      assert.equal(
        processor.processSync("'em hello' 'em").toString(),
        '‘em hello’ ’em'
      )
    }
  )

  await t.test(
    'should handle elisions after siblings are removed',
    async function () {
      assert.equal(
        processor.processSync("'em . . . 'bout 'cause").toString(),
        '’em … ’bout ’cause'
      )
      assert.equal(
        retext()
          .use(retextSmartypants, {dashes: 'inverted'})
          .processSync("'em —- 'bout 'cause")
          .toString(),
        '’em – ’bout ’cause'
      )
    }
  )

  await t.test(
    'should search again when transforming a tree again',
    async function () {
      const tree = retext().parse("'em text?")
      const transform = retextSmartypants()
      transform(tree)

      const paragraph = tree.children[0]
      assert.equal(paragraph.type, 'ParagraphNode')
      const sentence = paragraph.children[0]
      assert.equal(sentence.type, 'SentenceNode')
      sentence.children[0] = {type: 'PunctuationNode', value: "'"}
      sentence.children[sentence.children.length - 1] = {
        type: 'PunctuationNode',
        value: "'"
      }

      transform(tree)
      assert.equal(processor.stringify(tree), '‘em text’')
    }
  )

  await t.test(
    'should curl apostrophes when followed by a decade (`80s`)',
    async function () {
      assert.equal(
        processor.processSync("In the '90s.").toString(),
        'In the ’90s.'
      )
    }
  )

  await t.test(
    'should curl final double quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync('"Alfred bertrand". Cees.').toString(),
        '“Alfred bertrand”. Cees.'
      )
    }
  )

  await t.test(
    'should curl final single quotes when followed by a full stop',
    async function () {
      assert.equal(
        processor.processSync("'Alfred bertrand'. Cees.").toString(),
        '‘Alfred bertrand’. Cees.'
      )
    }
  )

  await t.test('should use quotes from options', async function () {
    assert.equal(
      retext()
        .use(retextSmartypants, {
          closingQuotes: {double: '»', single: '›'},
          openingQuotes: {double: '«', single: '‹'}
        })
        .processSync('Alfred "bertrand" \'cees\'.')
        .toString(),
      'Alfred «bertrand» ‹cees›.'
    )
  })

  await t.test(
    'should use correct quotes around work breaks',
    async function () {
      assert.equal(processor.processSync('("A.")').toString(), '(“A.”)')
    }
  )

  await t.test(
    'should use correct quotes around work breaks #1',
    async function () {
      assert.equal(processor.processSync('"~a').toString(), '“~a')
    }
  )

  await t.test(
    'should use correct quotes around work breaks #2',
    async function () {
      assert.equal(processor.processSync('"~*').toString(), '“~*')
    }
  )

  await t.test(
    'should use correct quotes around work breaks #3',
    async function () {
      assert.equal(processor.processSync('"~').toString(), '“~')
    }
  )

  await t.test(
    'should curl quotes followed by punctuation at the end of a word',
    async function () {
      assert.equal(
        processor.processSync("'한국어(테스트)'입니다.").toString(),
        '‘한국어(테스트)’입니다.'
      )
    }
  )

  await t.test(
    'should curl quotes followed by punctuation at the end of a word #1',
    async function () {
      assert.equal(
        processor.processSync("'누구인가?'라고 말했다.").toString(),
        '‘누구인가?’라고 말했다.'
      )
    }
  )

  await t.test(
    'should curl quotes followed by punctuation at the end of a word #2',
    async function () {
      assert.equal(
        processor.processSync("'맛있다~'라며 감탄했다.").toString(),
        '‘맛있다~’라며 감탄했다.'
      )
    }
  )

  await t.test(
    'should open a quote before punctuation and text',
    async function () {
      assert.equal(
        processor.processSync('"...? 뭐라고?"').toString(),
        '“…? 뭐라고?”'
      )
    }
  )

  await t.test('should open a quote around punctuation', async function () {
    assert.equal(processor.processSync('"?!"').toString(), '“?!”')
  })

  await t.test('should open a quote before a dash', async function () {
    assert.equal(processor.processSync('"—아니—"').toString(), '“—아니—”')
  })

  await t.test(
    'should close a quote after multiple punctuation marks',
    async function () {
      assert.equal(
        processor.processSync("'정말?!'이라고 말했다.").toString(),
        '‘정말?!’이라고 말했다.'
      )
      assert.equal(
        processor.processSync("'한국어((테스트))'입니다.").toString(),
        '‘한국어((테스트))’입니다.'
      )
    }
  )

  await t.test('should open nested quotes before CJK text', async function () {
    assert.equal(processor.processSync('"\'한국어\'"').toString(), '“‘한국어’”')
  })

  await t.test(
    'should handle nested quotes around a text node',
    async function () {
      /** @type {import('nlcst').Root} */
      const tree = {
        type: 'RootNode',
        children: [
          {
            type: 'ParagraphNode',
            children: [
              {
                type: 'SentenceNode',
                children: [
                  {type: 'PunctuationNode', value: '"'},
                  {type: 'PunctuationNode', value: "'"},
                  // Some parsers emit text directly in a sentence.
                  // @ts-expect-error: Test nonstandard input from such parsers.
                  {type: 'TextNode', value: '한국어'},
                  {type: 'PunctuationNode', value: "'"},
                  {type: 'PunctuationNode', value: '"'}
                ]
              }
            ]
          }
        ]
      }

      retextSmartypants()(tree)
      assert.equal(processor.stringify(tree), '“‘한국어’”')
    }
  )

  await t.test(
    'should close a quote after a punctuation node with multiple characters',
    async function () {
      /** @type {import('nlcst').Root} */
      const tree = {
        type: 'RootNode',
        children: [
          {
            type: 'ParagraphNode',
            children: [
              {
                type: 'SentenceNode',
                children: [
                  {type: 'PunctuationNode', value: "'"},
                  // @ts-expect-error: Test text emitted directly in a sentence.
                  {type: 'TextNode', value: '정말'},
                  {type: 'PunctuationNode', value: '?!'},
                  {type: 'PunctuationNode', value: "'"},
                  // @ts-expect-error: Test text emitted directly in a sentence.
                  {type: 'TextNode', value: '이라고'}
                ]
              }
            ]
          }
        ]
      }

      retextSmartypants()(tree)
      assert.equal(processor.stringify(tree), '‘정말?!’이라고')
    }
  )
})

test('En- and em-dashes', async function (t) {
  await t.test('should not throw when not omitted', async function () {
    retext().use(retextSmartypants, {dashes: false}).freeze()
  })

  await t.test('true', async function (t) {
    await t.test(
      'should replace two dashes with an em-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants)
            .processSync('Alfred--bertrand--cees.')
            .toString(),
          'Alfred—bertrand—cees.'
        )
      }
    )
  })

  await t.test('oldschool', async function (t) {
    await t.test(
      'should replace two dashes with an en-dash, three dashes with ' +
        'an em-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'oldschool'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred–bertrand—cees.'
        )
      }
    )

    await t.test(
      'should turn an en dash + dash into an em-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'oldschool'})
            .processSync('Alfred–-')
            .toString(),
          'Alfred—'
        )
      }
    )
  })

  await t.test('inverted', async function (t) {
    await t.test(
      'should replace two dashes with an em-dash, three dashes with ' +
        'an en-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'inverted'})
            .processSync('Alfred--bertrand---cees.')
            .toString(),
          'Alfred—bertrand–cees.'
        )
      }
    )

    await t.test(
      'should turn an em dash + dash into an en-dash',
      async function () {
        assert.equal(
          retext()
            .use(retextSmartypants, {dashes: 'inverted'})
            .processSync('Alfred—-')
            .toString(),
          'Alfred–'
        )
      }
    )
  })
})

test('Backticks', async function (t) {
  await t.test('should not throw when not omitted', async function () {
    retext().use(retextSmartypants, {backticks: false}).freeze()
  })

  await t.test(
    'should throw when `all` is combined with `quotes`',
    async function () {
      assert.throws(function () {
        retext().use(retextSmartypants, {backticks: 'all'}).freeze()
      }, /Cannot accept `backticks: 'all'` with `quotes: true`/)
    }
  )

  await t.test('true', async function (t) {
    const processor = retext().use(retextSmartypants, {quotes: false})

    await t.test(
      'should replace two backticks with an opening double quote',
      async function () {
        assert.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        )
      }
    )

    await t.test(
      'should replace two single quotes with a closing double quote',
      async function () {
        assert.equal(
          processor.processSync("Alfred'' bertrand.").toString(),
          'Alfred” bertrand.'
        )
      }
    )

    await t.test('should NOT replace a single backtick', async function () {
      assert.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '`Alfred bertrand.'
      )
    })

    await t.test('should NOT replace a single quote', async function () {
      assert.equal(
        processor.processSync("Alfred' bertrand.").toString(),
        "Alfred' bertrand."
      )
    })
  })

  await t.test('all', async function (t) {
    const processor = retext().use(retextSmartypants, {
      backticks: 'all',
      quotes: false
    })

    await t.test(
      'should replace two backticks with an opening double quote',
      async function () {
        assert.equal(
          processor.processSync('``Alfred bertrand.').toString(),
          '“Alfred bertrand.'
        )
      }
    )

    await t.test(
      'should replace two single quotes with a closing double quote',
      async function () {
        assert.equal(
          processor.processSync("Alfred'' bertrand.").toString(),
          'Alfred” bertrand.'
        )
      }
    )

    await t.test('should replace a single backtick', async function () {
      assert.equal(
        processor.processSync('`Alfred bertrand.').toString(),
        '‘Alfred bertrand.'
      )
    })

    await t.test('should replace a single quote', async function () {
      assert.equal(
        processor.processSync("Alfred' bertrand.").toString(),
        'Alfred’ bertrand.'
      )
    })
  })
})

test('Ellipses', async function (t) {
  const processor = retext().use(retextSmartypants)

  await t.test('should not throw when not omitted', async function () {
    assert.doesNotThrow(async function () {
      retext().use(retextSmartypants, {ellipses: false}).freeze()
    })
  })

  await t.test('should replace three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )
  })

  await t.test('should replace three initial full stops', async function () {
    assert.equal(
      processor.processSync('...Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    )
  })

  await t.test('should replace three final full stops', async function () {
    assert.equal(
      processor.processSync('Alfred Bertrand...').toString(),
      'Alfred Bertrand\u2026'
    )
  })

  await t.test('should replace three padded full stops', async function () {
    assert.equal(
      processor.processSync('Alfred ... Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    )
  })

  await t.test(
    'should replace three padded initial full stops',
    async function () {
      assert.equal(
        processor.processSync('... Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand ...').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test(
    'should replace three padded full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred . . . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . . Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand . . .').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test(
    'should replace three full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred. . . Bertrand.').toString(),
        'Alfred\u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . .Alfred Bertrand.').toString(),
        '\u2026Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand. . .').toString(),
        'Alfred Bertrand\u2026'
      )
    }
  )

  await t.test('should replace more than three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred..... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    assert.equal(
      processor.processSync('Alfred bertrand....').toString(),
      'Alfred bertrand\u2026'
    )

    assert.equal(
      processor.processSync('......Alfred bertrand.').toString(),
      '\u2026Alfred bertrand.'
    )
  })

  await t.test(
    'should replace more than three full stops with funky spacing',
    async function () {
      assert.equal(
        processor.processSync('Alfred .. .. . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should NOT replace less than three full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred.. Bertrand.').toString(),
        'Alfred.. Bertrand.'
      )

      assert.equal(
        processor.processSync('Alfred bertrand. .').toString(),
        'Alfred bertrand. .'
      )

      assert.equal(
        processor.processSync('.Alfred bertrand.').toString(),
        '.Alfred bertrand.'
      )
    }
  )
})

test('Ellipses (unspaced)', async function (t) {
  const processor = retext().use(retextSmartypants, {ellipses: 'unspaced'})

  await t.test('should replace three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )
  })

  await t.test('should replace three initial full stops', async function () {
    assert.equal(
      processor.processSync('...Alfred Bertrand.').toString(),
      '\u2026Alfred Bertrand.'
    )
  })

  await t.test('should replace three final full stops', async function () {
    assert.equal(
      processor.processSync('Alfred Bertrand...').toString(),
      'Alfred Bertrand\u2026'
    )
  })

  await t.test('should replace three padded full stops', async function () {
    assert.equal(
      processor.processSync('Alfred ... Bertrand.').toString(),
      'Alfred \u2026 Bertrand.'
    )
  })

  await t.test(
    'should replace three padded initial full stops',
    async function () {
      assert.equal(
        processor.processSync('... Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand ...').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test('should replace more than three full stops', async function () {
    assert.equal(
      processor.processSync('Alfred..... Bertrand.').toString(),
      'Alfred\u2026 Bertrand.'
    )

    assert.equal(
      processor.processSync('Alfred bertrand....').toString(),
      'Alfred bertrand\u2026'
    )

    assert.equal(
      processor.processSync('......Alfred bertrand.').toString(),
      '\u2026Alfred bertrand.'
    )
  })

  await t.test(
    'should NOT replace less than three full stops',
    async function () {
      assert.equal(
        processor.processSync('Alfred.. Bertrand.').toString(),
        'Alfred.. Bertrand.'
      )

      assert.equal(
        processor.processSync('Alfred bertrand. .').toString(),
        'Alfred bertrand. .'
      )

      assert.equal(
        processor.processSync('.Alfred bertrand.').toString(),
        '.Alfred bertrand.'
      )
    }
  )
})

test('Ellipses (spaced)', async function (t) {
  const processor = retext().use(retextSmartypants, {ellipses: 'spaced'})

  await t.test(
    'should replace three padded full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred . . . Bertrand.').toString(),
        'Alfred \u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . . Alfred Bertrand.').toString(),
        '\u2026 Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three padded final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand . . .').toString(),
        'Alfred Bertrand \u2026'
      )
    }
  )

  await t.test(
    'should replace three full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred. . . Bertrand.').toString(),
        'Alfred\u2026 Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three initial full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('. . .Alfred Bertrand.').toString(),
        '\u2026Alfred Bertrand.'
      )
    }
  )

  await t.test(
    'should replace three final full stops with spaces',
    async function () {
      assert.equal(
        processor.processSync('Alfred Bertrand. . .').toString(),
        'Alfred Bertrand\u2026'
      )
    }
  )
})
