#   Filename: hungarian_exceptions.py
#   Description: A file for all exceptions relating to the hungarian algorithm
#   Author: Daniel Cooke


class HungarianError(Exception):
    """The base class for all exceptions relating to the hungarian algorithm"""
    def __init__(self, matrix, msg=None):
        if msg is None:
            msg = "An error occurred when processing the matrix. %m" %matrix

        super(HungarianError, self).__init__(msg)
        self.matrix = matrix

class MatrixError(HungarianError):
    """Error relating to the input matrix being incorrectly formatted"""
    def __init__(self, matrix):
        super(MatrixError, self ).__init__(matrix, "The input matrix must be n-dimensional, ie. n x n")

        self.matrix = matrix