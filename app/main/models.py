class Data():
    id: str
    count: int


class FilterObj():
    def __init__(self, beginDate, endDate, age, schools, female, male, color):
        self.beginDate = beginDate
        self.endDate = endDate
        self.age = age
        self.schools = schools
        self.female = female
        self.male = male
        self.color = color
