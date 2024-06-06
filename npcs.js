// This script just combines the NPC knack, desire, and occupation tables to create dynamic NPCs on the fly

var desire = await game.tables.getName("NPC Desires").draw({ displayChat: false });
var knack = await game.tables.getName("NPC Knacks").draw({ displayChat: false });
var occupation = await game.tables.getName("NPC Occupation").draw({ displayChat: false });

desire = desire.results[0].data.text;
knack = knack.results[0].data.text;
occupation = occupation.results[0].data.text;

var occupation_table_name = `Occupations (${occupation})`;
var occupation_specific = await game.tables.getName(occupation_table_name).draw({ displayChat: false });
occupation_specific = occupation_specific.results[0].data.text;

const sentence = `<p> This NPC desires <b>${desire}</b> by utilizing <b>${knack}</b>. They work in the <b>${occupation}</b> field as a(n) <b>${occupation_specific}</b>.</p>`

const chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: sentence
};

ChatMessage.create(chatData);