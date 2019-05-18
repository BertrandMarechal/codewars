// Create a class called Warrior which calculates and keeps track of their level and skills, and ranks them as the warrior they've proven to be.
function Warrior() {
    // A warrior starts at level 1 and can progress all the way to 100.
    this._level = 1;
    this.level = () => this._level;
    
    // A warrior's experience starts from 100.    
    this._experience = 100;
    this.experience = () => this._experience;

    this._achievements = [];
    this.achievements = () => this._achievements;
    
    // A warrior starts at rank "Pushover" and can progress all the way to "Greatest".
    // The only acceptable range of rank values is "Pushover", "Novice", "Fighter", "Warrior", "Veteran", "Sage", "Elite", "Conqueror", "Champion", "Master", "Greatest".
    this._rank = "Pushover";
    this.rank = () => this._rank;

    // Warriors will compete in battles. Battles will always accept an enemy level to match against your own.
    this.battle = (l) => {
        console.log(l, this._level)
        // Return "A good fight" if your warrior is either 1 level higher or equal to your enemy's level.
        let result = "A good fight";
        // With each battle successfully finished, your warrior's experience is updated based on the enemy's level.
        if (l < 1 || l > 100) {
            // If an enemy level does not fall in the range of 1 to 100, the battle cannot happen and should return "Invalid level".
            return "Invalid level";
        }
        if (l === this._level) {
            // Completing a battle against an enemy with the same level as your warrior will be worth 10 experience points.
            this._experience += 10;
        } else if (l === this._level - 1) {
            // Completing a battle against an enemy who is one level lower than your warrior will be worth 5 experience points.
            this._experience += 5;
        }  else if (l < this._level - 1) {
            // Completing a battle against an enemy who is two levels lower or more than your warrior will give 0 experience points.
            // Return "Easy fight" if your warrior is 2 or more levels higher than your enemy's level.
            result = "Easy fight";
        } else if (l > this._level) {
            if (l - this._level > 5) {
                // However, if your warrior is at least one rank lower than your enemy,
                // and at least 5 levels lower, your warrior cannot fight against an enemy that
                // strong and must instead return "You've been defeated".
                return "You've been defeated";
            } else {
                // Completing a battle against an enemy who is one level higher or more than your warrior will accelarate your experience gaining.
                // The greater the difference between levels, the more experinece your warrior will gain.
                // The formula is 20 * diff * diff where diff equals the difference in levels between the enemy and your warrior.
                const diff = l - this._level;
                this._experience += 20 * diff * diff;
                // Return "An intense fight" if your warrior's level is lower than the enemy's level.
                result = "An intense fight";
            }
        }
        // check experience
        // The experience earned from the battle is relative to what the warrior's current level is compared to the level of the enemy.
        this._checkExperience();

        return result;
    }
    this._checkExperience = () => {
        const ranks = ["Pushover", "Novice", "Fighter", "Warrior", "Veteran", "Sage", "Elite", "Conqueror", "Champion", "Master", "Greatest"];
        // A warrior's experience is cumulative, and does not reset with each rise of level. The only exception is when the warrior reaches level 100, with which the experience stops at 10000
        this._experience = Math.min(this._experience, 10000);

        // Each time the warrior's experience increases by another 100, the warrior's level rises to the next level.
        this._level = Math.floor(this._experience / 100);

        // At every 10 levels, your warrior will reach a new rank tier. (ex. levels 1-9 falls within "Pushover" tier, levels 80-89 fall within "Champion" tier, etc.)
        this._rank = ranks[Math.floor(this._level / 10)];
    }

    // In addition to earning experience point from battles, warriors can also gain experience points from training.
    // Training will accept an array of three elements (except in java where you'll get 3 separated arguments): the description, the experience points your warrior earns, and the minimum level requirement.
    this.training = ([description, exp, minLevel]) => {
        // If the warrior's level meets the minimum level requirement, the warrior will receive the experience points from it and store the description of the training. It should end up returning that description as well.
        if (this._level >= minLevel) {
            this._experience += exp;
            this._checkExperience();
            this._achievements.push(description);
            return description;
        } else {
            // If the warrior's level does not meet the minimum level requirement, the warrior doesn not receive the experience points and description and instead returns "Not strong enough", without any archiving of the result.
            return "Not strong enough";
        }
    }
}


// If a warrior level 1 fights an enemy level 1, they will receive 10 experience points.
// If a warrior level 1 fights an enemy level 3, they will receive 80 experience points.
// If a warrior level 5 fights an enemy level 4, they will receive 5 experience points.
// If a warrior level 3 fights an enemy level 9, they will receive 720 experience points, resulting in the warrior rising up by at least 7 levels.
// If a warrior level 8 fights an enemy level 13, they will receive 0 experience points and return "You've been defeated". (Remember, difference in rank & enemy level being 5 levels higher or more must be established for this.)
// If a warrior level 6 fights an enemy level 2, they will receive 0 experience points.