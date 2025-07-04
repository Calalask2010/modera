from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, TextAreaField, SubmitField, validators
from wtforms.validators import DataRequired, Email, Length

class ContactForm(FlaskForm):
    name = StringField('Имя', validators=[DataRequired(), Length(min=2, max=100)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    subject = StringField('Тема', validators=[DataRequired(), Length(min=5, max=200)])
    message = TextAreaField('Сообщение', validators=[DataRequired(), Length(min=10, max=1000)])
    submit = SubmitField('Отправить')

class AudioUploadForm(FlaskForm):
    title = StringField('Название трека', validators=[DataRequired(), Length(min=2, max=200)])
    artist = StringField('Исполнитель', validators=[DataRequired(), Length(min=2, max=200)])
    audio_file = FileField('Аудиофайл', validators=[
        DataRequired(),
        FileAllowed(['mp3', 'wav', 'ogg'], 'Только аудиофайлы!')
    ])
    submit = SubmitField('Загрузить')

class PortfolioForm(FlaskForm):
    title = StringField('Название проекта', validators=[DataRequired(), Length(min=2, max=200)])
    description = TextAreaField('Описание', validators=[DataRequired(), Length(min=10, max=1000)])
    image_url = StringField('URL изображения')
    project_url = StringField('URL проекта')
    technologies = StringField('Технологии', validators=[Length(max=500)])
    submit = SubmitField('Добавить')

class BlogForm(FlaskForm):
    title = StringField('Заголовок', validators=[DataRequired(), Length(min=5, max=200)])
    content = TextAreaField('Содержание', validators=[DataRequired(), Length(min=50)])
    image_url = StringField('URL изображения')
    submit = SubmitField('Опубликовать')
