import sqlite3
from flask import Flask, jsonify, render_template
import pandas as pd
from sqlalchemy import create_engine

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Exception as e:
        print(e)
    return conn

df = pd.read_csv("project\data\Amazon.csv")
connection = create_connection("demo.db")
df.to_sql('Amazon',connection,if_exists='replace')
connection.close();

db_url = 'sqlite:///demo.db'
engine = create_engine(db_url, echo=True)
df_2 = pd.read_sql('select * from Amazon',engine)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-datachart')
def get_datachart():
    classes = df["Item Type"].value_counts().index
    values = df["Item Type"].value_counts().values
    data = []
    for i in range(len(classes)):
        data.append({"class": classes[i], "value": int(values[i])})

    return jsonify(data)

@app.route('/get-datatable')
def get_datatable():
    region_counts = df['Region'].value_counts()
    data = [{"region": region, "revenue": count} for region, count in region_counts.items()]

    return jsonify(data)


@app.route('/get-datavalue')
def get_datavalue():
    sales_channel_profit = df.groupby('Sales Channel')['Total Profit'].sum().reset_index()
    data = sales_channel_profit.to_dict(orient='records')
    return jsonify(data)



@app.route('/get_datademo')
def get_datademo():
    item_types = df["Item Type"][:5]
    units_sold = df["Units Sold"][:5]
    data = [{"Item Type": item, "Units Sold": int(units)} for item, units in zip(item_types, units_sold)]

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
