import pandas as pd

from . import models

# Load data as panda dfs #
portraits_meta = pd.read_csv("data/omniart_v3_portrait.csv")
heatmap_csv = pd.read_csv("data/heatmap.csv")
faces = pd.read_json("data/faces_new.json")
color_groups = pd.read_json("data/group_centers.json")


# portrait_data = pd.read_csv("data/portraits.csv")

##########################

def get_portraits_by_year(begin_date: str, end_date: str):
    return portraits_meta.query(begin_date + ' <= creation_year <= ' + end_date)


def get_heatmap():
    return heatmap_csv


def get_portraits_by_year_by_params(filterObj: models.FilterObj):
    # Age filter
    df = faces[faces['age'].isin(filterObj.age)]
    # Gender filter
    df = female_male_filter(df, filterObj)

    # Color filter
    # df = df[df['color'].isin(filterObj.color)]

    # Filter period
    # portraits_filtered = portraits_meta[~portraits_meta.century.isin([8,13])] #Doesnt work....
    result = portraits_meta.query(filterObj.beginDate + ' <= creation_year <= ' + filterObj.endDate)
    # Match both datasets
    end = result[result['id'].isin(df['imgid'])]  # Wrong?
    # end = pd.merge(result, df, left_on='id', right_on='imgid') #Right? But app fails if used this

    print('Amount of results for query: ', len(end))
    return end


def toColor(color: str):
    return str("#" + color)


def female_male_filter(df, filterObj):
    if filterObj.female is True and filterObj.male is not True:
        df = df.query('gender == "Female"')
    if filterObj.male is True and filterObj.female is not True:
        df = df.query('gender == "Male"')
    return df


def get_portraits():
    return portraits_meta


def get_bubble(filterObj):
    color_groups.columns = ['R', 'G', 'B', 'group']
    portraits = get_portraits_by_year_by_params(filterObj)
    print(portraits.columns)
    portraits.columns = ["Unnamed: 0",
                         "imgid",
                         "artwork_name",
                         "artist_full_name",
                         "artist_first_name",
                         "artist_last_name",
                         "creation_year",
                         "century",
                         "source_url",
                         "image_url",
                         "collection_origins",
                         "artwork_type",
                         "school",
                         "original_id_in_collection",
                         "created_at",
                         "last_modified",
                         "omni_id",
                         "created_by_id",
                         "general_type",
                         "geocoded",
                         "color_pallete",
                         "dominant_color",
                         "palette_count"]

    # print(portraits.loc[0])
    merged = pd.merge(portraits, faces, on=['imgid'], how='outer')
    print(merged.loc[0])
    # print(faces)
    # meta_faces = portraits[portraits['id'].isin(faces['imgid'])]
    dfGrouped = merged.groupby(['gender', 'age', 'group', 'century'])
    dfGrouped = dfGrouped.imgid.agg('count').to_frame('count').reset_index()
    dfGrouped = pd.merge(dfGrouped, color_groups, on='group', how='outer')
    return dfGrouped[['R', 'G', 'B', 'gender', 'age', 'count', 'century']]
