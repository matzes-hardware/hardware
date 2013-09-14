#!/usr/bin/python

from htmlparser import between, betweens
from svg import *

svg = open("Pteranodon.svg").read()

piece_group = between(svg, "<g\n", "</g>", include_before=True, include_after=True)
path_xml = betweens(piece_group, "<path\n", "/>", include_before=True, include_after=True)

#for p in path_xml:
#    piece_group = piece_group.replace(p,'')

paths = []
for p in path_xml:
    P = Path(p)
    if len(P.d) == 2:
        paths.append( P )
    else:
        piece = P

print '\nBezier:'
print str(piece)

print '\nSpalten:'
for path in paths:
    print str(path)

open("Pteranodon2.svg","w").write(svg)
