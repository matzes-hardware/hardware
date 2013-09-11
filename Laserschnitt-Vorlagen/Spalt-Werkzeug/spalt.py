#!/usr/bin/python

from htmlparser import between, betweens
from svg import *

svg = open("Pteranodon.svg").read()

piece_group = between(svg, "<g\n", "</g>", include_before=True, include_after=True)
path_xml = betweens(piece_group, "<path\n", "/>", include_before=True, include_after=True)

#for p in path_xml:
#    piece_group = piece_group.replace(p,'')

path = []
for p in path_xml:
    P = Path(p)
    print str(P)
    print P.points
    if len(P.d) == 3:
        # cut
        path.append( P )
    else:
        # piece
        piece = P
        print 'PIECE'

open("Pteranodon2.svg","w").write(svg)
