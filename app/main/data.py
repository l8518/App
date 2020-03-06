import pandas as pd
import numpy as np
from . import models

# Load data as panda dfs #
# stats_ams = pd.read_csv('app/data/ams_stats_infovis.csv')
# stats_ams_meta = pd.read_csv("app/data/ams_stats_infovis_metadata.csv", sep=";")
portraits_meta = pd.read_csv("omniart_eye_dataset/omniart_metadata.csv")
heatmap_csv = pd.read_csv("data/heatmap.csv")
test_data = pd.read_csv("data/sp500.csv")
portrait_data = pd.read_csv("data/portraits.csv")

##########################

def get_portraits_by_year(begin_date:str, end_date:str):
    return portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date)

def get_heatmap():
    return heatmap_csv

def get_portraits():
    return portrait_data

def get_testdata():
    return test_data
