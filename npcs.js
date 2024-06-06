// This script just combines the NPC knack, desire, occupation, and trait tables to create dynamic NPCs on the fly

var desire = await game.tables.getName("NPC Desires").draw({ displayChat: false });
var knack = await game.tables.getName("NPC Knacks").draw({ displayChat: false });
var occupation = await game.tables.getName("NPC Occupation").draw({ displayChat: false });
var trait1 = await game.tables.getName("NPC Traits").draw({ displayChat: false });
var trait2 = await game.tables.getName("NPC Traits").draw({ displayChat: false });

desire = desire.results[0].data.text;
knack = knack.results[0].data.text;
occupation = occupation.results[0].data.text;
trait1 = trait1.results[0].data.text;
trait2 = trait2.results[0].data.text;

// Remove duplicate traits
while (trait1 === trait2) {
    trait2 = await game.tables.getName("NPC Traits").draw({ displayChat: false });
    trait2 = trait2.results[0].data.text;
}

// Occupation subtype
var occupation_table_name = `Occupations (${occupation})`;
var occupation_specific = await game.tables.getName(occupation_table_name).draw({ displayChat: false });
occupation_specific = occupation_specific.results[0].data.text;

const sentence = `<p> 
This NPC desires <b>${desire}</b> by using <b>${knack}</b>.<br>
<br>
<b>Occupation:</b> ${occupation_specific} (${occupation}) <br>
<br>
<b>Traits:</b> ${trait1}, ${trait2}
</p>`

const chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: sentence
};

ChatMessage.create(chatData);