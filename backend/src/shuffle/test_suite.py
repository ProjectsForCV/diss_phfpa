#   Filename: test_suite.py
#   Description: A test suit for testing fisher yates shuffle
#   Author: Daniel Cooke

import unittest

from src.shuffle import fisher_yates


class FisherYatesTestCase(unittest.TestCase):

    #placeholder object to test shuffle with - TODO: replace with real object from system
    class ArbObject():

        def __init__(self, id, pref):
            self.id = id
            self.pref = pref

    def setUp(self):
        #setup some data to shuffle
        self.numberList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
        self.objectList = [
            self.ArbObject(1,[
                {'DG01' :10},
                {'DG04': 1},
                {'DG05': 8},
                {'DG02': 4},
                {'DG99': 2},
                {'DG06': 3},
                {'DG10': 22}
            ]),
            self.ArbObject(2, [
                {'DG01': 2},
                {'DG04': 3},
                {'DG05': 4},
                {'DG02': 5},
                {'DG99': 6},
                {'DG06': 7},
                {'DG10': 1}
            ]),
            self.ArbObject(3, [
                {'DG01': 4},
                {'DG04': 3},
                {'DG05': 2},
                {'DG02': 4},
                {'DG99': 5},
                {'DG06': 6},
                {'DG10': 1}
            ])
        ]

    def test_number_shuffle(self):
        pos = []
        original = self.numberList[:]
        for i in range(0, 100):
            fisher_yates.shuffle(self.numberList)
            pos.append(self.numberList)

        self.assertTrue(original not in pos , 'an unshuffled version of the original list was produced')



def suite():
    suite1 = unittest.TestLoader().loadTestsFromTestCase(FisherYatesTestCase)

    return unittest.TestSuite([suite1])


unittest.TextTestRunner(verbosity=2).run(suite())
