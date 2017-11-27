#   Filename: node.py
#   Description: Used in graph implementation to store edges and values of each vertex
#   Author: Daniel Cooke

class Vertex:

    def __init__(self, val, edges):
        self.val = val
        self.edges = edges
