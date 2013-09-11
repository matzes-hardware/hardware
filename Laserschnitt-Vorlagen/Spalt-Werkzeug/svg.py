#!/usr/bin/python

from htmlparser import between

class Point:
    def __init__(self, coord):
        s = coord.split(',')
        self.x = s[0]
        self.y = s[1]
    
    def __str__(self):
        return self.x+','+self.y


class MoveTo:
    def __init__(self, path):
        self.moveTo = Point(path.split(' ')[1])
        
    def __str__(self):
        return 'm '+str(self.moveTo)


class LineTo:
    def __init__(self, path):
        self.lineTo = Point(path)

    def __str__(self):
        return 'l '+str(self.lineTo)

class CubicBezier:
    def __init__(self, path):
        self.bezierTriples = []
        points = path.split(' ')[1:]
        print points
        i = 0
        while i < range(len(points)):
            t = ( Point(points[i]), Point(points[i+1]), Point(points[i+2]) )
            self.bezierTriples.append(t)
            i += 3
            if (i >= len(points)) or (points[i][0] not in '-0123456789'):
                break
        print str(len(self.bezierTriples))+' Bezierhandles geparst'
    
    def __str__(self):
        return 'c '+' '.join([str(b[0])+' '+str(b[1])+' '+str(b[2]) for b in self.bezierTriples])


class Path:
    def __init__(self, xml):
        self.d = []
        self.points = 0
        data = between(xml.strip(), ' d="', '"').split(' ')
        current = 0
        mode = 'l'
        while current < len(data):
            p = data[current]
            from_here = ' '.join(data[current:])
            if p == 'm':
                self.d.append( MoveTo(from_here) )
                current += 2
            elif p == 'z':
                self.d.append('z')
                current += 1
            elif p[0] in '-0123456789' and mode != 'm':
                p = mode
            if p == 'c':
                curve = CubicBezier(from_here)
                self.d.append(curve)
                current += 1+(len(curve.bezierTriples)*3)
                mode = 'c'
            elif p == 'l':
                self.d.append(LineTo(from_here))
                current += 1
                mode = 'l'

    def __str__(self):
        return ' '.join( [str(p) for p in self.d] )
