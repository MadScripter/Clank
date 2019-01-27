#!/usr/bin/env node

'use strict';

/**
 * 1 - name
 * 2 - description
 * 3 - roles
 * 4 - permissions
 */
const path = require('path');
const { Form, Input } = require('enquirer');

const input = (name, message, initial) => {
    return prompt => {
      let p = new Input({ name, message, initial });
      return p.run().then(value => ({ name, message, initial: value, value }));
    };
  };

const prompt = new Form({
    name: 'user',
    message: 'Please review your answers:',
    choices: [
      input('name', 'Project name', path.basename(process.cwd())),
      input('author', 'Author name', 'jonschlinkert'),
      input('username', 'GitHub username/org', 'enquirer'),
      {
        name: 'repo',
        message: 'Repository URL',
        onChoice(state, choice, i) {
          let { name, username } = this.values;
          choice.initial = `https://github.com/${username}/${name}`;
        }
      }
    ]
  });

const questions = [
    {
        type: 'input',
        name: 'name',
        message: `Enter a name for the command`
    },
    {
        type: 'input',
        name: 'description',
        message: `Enter a description`
    },
    {
        type: 'list',
        name: 'roles',
        message: `Enter a list of roles authorized to use this command (comma-seperated)`
    },
    {
        type: 'input',
        name: 'permissions',
        message: `Enter a list of permissions needed to run this command`
    },
]

async function run()
{
    try
    {
        const reponse = await prompt.run()

        console.log(response)
    }
    catch
    {

    }
}

run()
/*prompt.run()
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.log);*/