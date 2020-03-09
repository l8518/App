class Data():
    id: str
    count: int


class FilterObj():
    def __init__(self, beginDate, endDate, age, female, male, color, selectedTimePeriod):
        self.beginDate = beginDate
        self.endDate = endDate
        self.age = age
        self.female = female
        self.male = male
        self.color = color
        self.selectedTimePeriod = selectedTimePeriod
