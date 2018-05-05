FROM java:8

# preserve Java 8  from the maven install.
RUN mv /etc/alternatives/java /etc/alternatives/java8
RUN apt-get update -y && apt-get install maven -y
# Restore Java 8

RUN mv -f /etc/alternatives/java8 /etc/alternatives/java
RUN ls -l /usr/bin/java && java -version


RUN apt-get update
# RUN mkdir "/code"

# Install Ruby
RUN apt-get install -y ruby
# Install Rspec
RUN gem install rspec

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update -qqy && apt-get -qqyy install \
    nodejs \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g mocha
# RUN apt-get install -y build-essential

WORKDIR /usr/src/autograding

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "src/app.js"]

# CMD ["/bin/bash"]
