import streamlit as st
import pandas as pd
import streamlit.components.v1 as components

st.title("Satellite attiude watcher")
st.write("insert the csv file in the dropbox")
# file = st.file_uploader("upload the csv file ")
import streamlit as st

uploaded_file = None


with st.sidebar.form("file-form", clear_on_submit=True):
    file = st.file_uploader("FILE UPLOADER")
    submitted = st.form_submit_button("UPLOAD!")

    if submitted and file is not None:
        st.write("UPLOADED!")
        # Process your file here
        uploaded_file = file  # file is set in the sidebar form above


if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    st.write("DataFrame loaded successfully!")
    st.dataframe(df)

else:
    st.write("Please upload a CSV file to display its contents.")


with open("earth_orbit.html", "r") as f:
    html_string = f.read()

components.html(html_string, height=880, width=880, scrolling=True)
