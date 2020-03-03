class Data():
    id:str
    count:int

class FilterObj():
	def __init__(self, beginDate, endDate, beginAge, endAge, schools, female, male):
	    self.beginDate = beginDate
	    self.endDate = endDate
	    self.beginAge = beginAge
	    self.endAge = endAge
	    self.schools = schools
	    self.female = female
	    self.male = male