# original script. https://github.com/iancoleman/bip39/blob/master/compile.py
#
import os
import re
import datetime
from io import open

# This script generates the bip39-standalone.html file.

# It removes script and style tags and replaces with the file content.

f = open('src/index.html', "r", encoding="utf-8")
page = f.read()
f.close()


# Script tags

scriptsFinder = re.compile("""<script src="(.*)"></script>""")
scripts = scriptsFinder.findall(page)

for script in scripts:
    filename = os.path.join('src', script)
    s = open(filename, "r", encoding="utf-8")
    scriptContent = "<script>%s</script>" % s.read()
    s.close()
    scriptTag = """<script src="%s"></script>""" % script
    page = page.replace(scriptTag, scriptContent)


# Style tags

stylesFinder = re.compile("""<link href="(.*)" rel="stylesheet" type="text/css">""")
styles = stylesFinder.findall(page)

for style in styles:
    filename = os.path.join('src', style)
    print("Processing style: %s" % filename)
    s = open(filename, "r", encoding="utf-8")
    styleContent = "<style>%s</style>" % s.read()
    s.close()
    styleTag = """<link href="%s" rel="stylesheet" type="text/css">""" % style
    page = page.replace(styleTag, styleContent)


# Write the standalone file

f = open('index.html', 'w', encoding="utf-8")
f.write(page)
f.close()

print("%s - DONE" % datetime.datetime.now())
