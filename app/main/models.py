class Data():
    id:str
    count:int

class FilterObj():
	def __init__(self, beginDate, endDate, beginAge, endAge, schools, female, male, color):
	    self.beginDate = beginDate
	    self.endDate = endDate
	    self.beginAge = beginAge
	    self.endAge = endAge
	    self.schools = schools
	    self.female = female
	    self.male = male
	    self.color = color