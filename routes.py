import os
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_mail import Message
from werkzeug.utils import secure_filename
from app import app, db, mail
from models import BlogPost, Portfolio, Contact
from forms import ContactForm, PortfolioForm, BlogForm

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')




