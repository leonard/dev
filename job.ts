function format(string, data): string {
   
    var formatted = string;
    
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            formatted = formatted.replace(regexp, data[i]);    
        }
        
    }
    return formatted;
}


class Salary {
    private amount: number;
    private person: ProfessionalHuman;

    constructor(amount: number = 0, person: ProfessionalHuman) {
        this.amount = amount;
        this.person = person;
    }

    amount(amount?: number = 0) {
        this.amount = amount > 0 ? amount : this.amount;
        return this.amount;
    }

    isAdequate() {
        return this.person.totalPerformance > this.amount * 2;
    }
}

abstract class Position {
    abstract rules: object[];

    getRules() {
        return this.rules;
    }
}

class ArtDirectorPosition extends Position { rules: [ { taste: 'impeccable'} ]}
class UIDesignerPosition extends Position { rules: [ { awesome: true} ]}
class UXDesignerPosition extends Position { rules: [ { smartest: true} ]}
class BackendDeveloperPosition extends Position { rules: [ { system: true} ]}
class TeamLeadPositon extends Position { rules: [ { system: true} ]}
class CozyManagerPosition extends Position { rules: [ { system: true} ]}

class FrontendDeveloperPosition extends Position {
    private rules = [
        {
            know: 'react',
            minExperience: 60*60*24*365*1000,
            required: true,
        },
        {
            required: false,
            know: 'nodejs',
        },
        {
            know: 'html',
            minExperience: 3 * 60*60*24*365*1000,
            required: true,
        },
        {
            required: true,
            know: 'responsive layout',
        },
        {
            required: false,
            know: 'flex',
        },
        {
            required: false,
            know: 'unix console',
        }
    ];
}

class Human {

    profile;
    name:string = "anonymous";

    constructor(profile = {}) {
        this.profile = profile
    }

    like(what) {
        return this.profile.hasOwnProperty(what) && this.profile[what].like;
    }

    say(what) {
        console.log(this.name + ": – " + what);
    }
    
    setName(name:string) {
        this.name = name;
    }
}

abstract class ProfessionalHuman extends Human {
    abstract getSalary(): Salary;
    abstract know(what: string): boolean;
    abstract experience(what: string): number;
    abstract like(what: string): boolean;
    abstract totalPerformance(): number;
}

class BreadheadTeamMember {
    position: Position;
    person: Human;
    workAddress: string = "Italianskaya street, 14";
    salary: Salary;

    constructor(person: Human, position: Position) {
        this.person = person;
        this.position = position;
    }
}


class Breadhead {
    
    static get(): Breadhead {
        return (new this());
    }
    
    protected contacts: {
        email: 'hello@breadhead.ru',
        phone: '+78129383779'
    }
    
    teamMembers: BreadheadTeamMember[] = [

        // DESIGN TEAM:

        new BreadheadTeamMember(new Human({name: 'Denis'}), ArtDirectorPosition),
        new BreadheadTeamMember(new Human({name: 'Ian',}), UIDesignerPosition),
        new BreadheadTeamMember(new Human({name: 'Lena'}), UIDesignerPosition),
        new BreadheadTeamMember(new Human({name: 'Dima'}), UIDesignerPosition),
        new BreadheadTeamMember(new Human({name: 'Daria'}), UXDesignerPosition),

        // DEVELOPMENT TEST:

        new BreadheadTeamMember(new Human({name: 'Misha'}), BackendDeveloperPosition),
        new BreadheadTeamMember(new Human({name: 'Katya',}), BackendDeveloperPosition),
        new BreadheadTeamMember(new Human({name: 'Masha'}), BackendDeveloperPosition),

        new BreadheadTeamMember(new Human({name: 'Vania'}), FrontendDeveloperPosition),
        new BreadheadTeamMember(new Human({name: 'Roman', leaving: true}), FrontendDeveloperPosition),

        new BreadheadTeamMember(new Human({name: 'Leonid'}), TeamLeadPositon),
        
        // COMFORT 

        new BreadheadTeamMember(new Human({name: 'Pasha'}), CozyManagerPosition),
        
    ];

    getHR () {
        return new HRManager(this);
    }
}

class HRManager extends Human {

    company;
    
    phrases = {
        'know': [
            `Are you experienced with {know}?`, 
            `Do you know {know}?`,
            `And what's about {know}?`,
        ],
        'bad': [
            "That's bad... But it isn't required, so let's continue.",
            "Not good. But it isn't required, so let's continue.",
        ],
        'good': [
            "Super!",
            "Great!",
            "That's good.",
        ]
        
    }
    
    constructor(company, profile = {}) {
        super(profile);
        this.setName('Leonid');
        this.company = company;
        
    }
    
    say(code: string, data?: object) {
        let phrase = code;
        if (this.phrases[code] && this.phrases[code].length) {
            phrase = this.phrases[code][Math.floor(Math.random()*this.phrases[code].length)];
        }
        
        super.say(format(phrase, data));
    }

    interview(candidate:ProfessionalHuman, position: Position): boolean {

        this.say("Hi " +  candidate.name + ". My name is " + this.name + ". I'm going to ask you a few questions. Ok?");
        candidate.say("Hi " +  this.name + ". Okey, let's go!");

        if (this.askQuestions(candidate, position)) {
            
            this.say("Your experience is enought. So, what about salary?");
            
            let salary = candidate.getSalary();
            
            if (salary.amount()) {
                candidate.say('I want about '+salary.amount());

                if (!salary.isAdequate()) {
                    this.say("Are you sure about salary? If so, sorry but we couldn't offer this job for you." );
                    return false;
                }
                
            } else {
                candidate.say("It doesn't matter for me.");
            }

            this.say("After all, do you wan't to work with us?");
            
            if (candidate.like('breadhead')){
                candidate.say("Yes, I like Breadhead so I want to join you")
                
                let newMember = new BreadheadTeamMember(candidate, FrontendDeveloperPosition);
                newMember.salary = salary;
                this.company.teamMembers.push(newMember);
                
                this.say('Hooray! We have new front-end developer. He is perfect');
            } else {
                you.say("Not really. Just wanted to pass the test :)");
                
                this.say("You are awesome. But if you don't like us it'll be your choise");
            }
        }
        return true;
    }
    
    askQuestions(candidate:ProfessionalHuman, position: Position): boolean {
        let rules = position.getRules();
        for (let rule of rules) {
            rule.status = true;
            if (rule.hasOwnProperty('know')) {
                this.say("know", rule);
                if (candidate.know(rule.know)) {
                    candidate.say("Sure!");

                    if (rule.hasOwnProperty('minExperience')) {
                        this.say('How long?');
                        if (candidate.experience(rule.know)) {
                            candidate.say('For about ' + (new Date(candidate.experience(rule.know)).getFullYear() - 1970) + " years!");
                        } else {
                            candidate.say("Not so much...");
                        }

                        if (candidate.experience(rule.know) >  rule.minExperience) {
                            this.say('good');
                        } else {
                            rule.status = false;
                        }
                    } else {
                        this.say('good');
                    }
                } else {
                    candidate.say("No...");
                    rule.status = false;
                }
            }
            if (!rule.status) {
                if (!rule.required) {
                    this.say("bad")
                } else {
                    this.say("It is important for us. I think we don't need to continue. Good luck!")
                    return false;
                }
            }
        }
        return true;
    }
}

// class Candidate extends ProfessionalHuman {
//     constructor(profile = {}) {
//         super(profile);
//     }
//
//     know(what) {
//         return this.profile.hasOwnProperty(what);
//     }
//
//     experience(what) {
//         return this.profile.hasOwnProperty(what) ? new Date() - this.profile[what].start : 0;
//     }
//
//     getSalary(): Salary {
//         return new Salary(this.profile.salary , this);
//     }
//
//     totalPerformance(): number {
//         return this.profile.performance
//     }
// }
//
//
// let you = new Candidate({
//     react: {
//         like: true,
//         start: new Date('2015-01-01')
//     },
//     html: {
//         start: new Date('2010-01-01')
//     },
//     breadhead: {
//         like: true
//     },
//     'responsive layout': {
//         like: true,
//         start: new Date('2010-01-01')
//     }
// });
//
//
// if (Breadhead.get().getHR().interview(you, new FrontendDeveloperPosition())) {
//     //invide();
// }
