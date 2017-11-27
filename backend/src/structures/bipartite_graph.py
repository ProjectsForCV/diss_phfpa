#   Filename: bipartite_graph.py
#   Description: A bipartite graph is useful for thinking about the assignment problem, here i have created an object
#                  orientated implementation.
#   Author: Daniel Cooke
import logging

import math

from src.structures.vertex import Vertex


class BipartiteGraph:


    def getVertices(self, set1, set2, edges):
        # Creates vertices array from passed in list of sets and edges
        size = len(set1)
        v1 = []
        v2 = []

        edges = [edges[i:i + size] for i in range(0, len(edges), size)]

        for i in range(size):
            v1.append(Vertex(set1[i],edges[i]))
            v2.append(Vertex(set2[i],edges[i]))

        self.v1 = v1
        self.v2 = v2


    def __init__(self, set1, set2, edges):
        if(len(set1) != len(set2)):
            # TODO: create custom errors for graphs
            logging.getLogger().error("The size of set 1 must equal the size of set 2")
            return

        if(len(edges) != math.pow(len(set1),2)):
            logging.getLogger().error("The number of edges must be n^2 where n is the size of each set.")
            return


        self.getVertices(set1, set2, edges)

g = BipartiteGraph(["Mandy", "Jim", "Andy"],["Clean Windows", "Wash Floor", "Lift Rubbish"], [2,3,1,3,1,2,2,1,3])
