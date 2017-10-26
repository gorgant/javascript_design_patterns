from flask import (Flask,  #loads the flask app functionality, #constructs urls, #renders html temlates
                  url_for, #constructs urls
                  render_template, #renders html temlates
                  request, #handles get/post requests
                  redirect, #handles redirect requests
                  flash, #allows for flash messages
                  jsonify) #enables us to configure an api endpoint for our application

#Instantiate the Flask app
app = Flask(__name__)

@app.route('/') #These "decorators" run the code below them IF the conditions are matched, in this case, if we are routed to the directories in the parenthesis
@app.route('/map/')
def loadmap():
  return "hello world"

if __name__ == '__main__':
  app.secret_key = 'super_secret_key'
  app.debug = True #Flask operation that automatically restarts server when change detected
  app.run(host = '0.0.0.0', port = 7997) #By default, server is only accessible from host machine, but b/c we are using vagrant, this sets the server to public