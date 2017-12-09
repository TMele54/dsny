def collegeScorecard():
    def filter_data(data_dictionary):
        import pandas as pd
        import json
        data_list = list(data_dictionary)

        #path, file
        path = "data/collegeScorecard/"
        file = "data.csv"

        # get csv data
        df = pd.read_csv(path+file).filter(items=data_dictionary.keys())
        dict = list(df.T.to_dict().values())
        out_file = "filteredData.json"

        with open(path+out_file, 'w') as fp:
            json.dump(dict, fp, sort_keys=True, indent=4)
            fp.close()

        return None

    data_dictionary = {
        "UNITID": "Unit ID for institution",
        "INSTNM": "Institution name",
        "CITY": "City",
        "STABBR": "State postcode",
        "ZIP": "ZIP code",
        "INSTURL": "URL for institution's homepage",
        "SCH_DEG": "Predominant degree awarded (recoded 0s and 4s)",
        "MAIN": "Flag for main campus",
        "NUMBRANCH": "Number of branch campuses",
        "REGION": "Region (IPEDS)",
        "LATITUDE": "Latitude",
        "LONGITUDE": "Longitude",
        "MENONLY": "Flag for men-only college",
        "WOMENONLY": "Flag for women-only college",
        "ADM_RATE": "Admission rate",
        "SAT_AVG": "Average SAT equivalent score of students admitted",
        "CURROPER": "Flag for currently operating institution, 0=closed, 1=operating",
        "COSTT4_A": "Average cost of attendance (academic year institutions)",
        "COSTT4_P": "Average cost of attendance (program-year institutions)",
        "TUITIONFEE_IN": "In-state tuition and fees",
        "TUITIONFEE_OUT": "Out-of-state tuition and fees",
        "TUITFTE": "Net tuition revenue per full-time equivalent student",
        "AVGFACSAL": "Average faculty salary",
        "PFTFAC": "Proportion of faculty that is full-time",
        "LOAN_EVER": "Share of students who received a federal loan while in school",
        "PELL_EVER": "Share of students who received a Pell Grant while in school",
        "AGE_ENTRY": "Average age of entry",
        "ALIAS": "Institution name aliases",
        "GRADS": "Number of graduate students"
    }

    filter_data(data_dictionary)
    return None