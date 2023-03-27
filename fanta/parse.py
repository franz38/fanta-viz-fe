import pandas as pd

dfs = []
for i in range (1,4):
    file_name = "./raw/Voti_Fantacalcio_Stagione_2021_22_Giornata_" + str(i) + ".xlsx"
    df = pd.read_excel(file_name, header=5)
    df = df[ (pd.notnull(df.Ruolo)) & (df.Ruolo != "All") & (df.Ruolo != "Ruolo") ]
    dfs.append(df)
df = pd.concat(dfs)
df.to_csv("parsed.csv")