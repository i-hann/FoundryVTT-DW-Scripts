

var aesthetic = await game.tables.getName("Magic Item Aesthetic").draw({ displayChat: false });
var appearance = await game.tables.getName("Magic Item Appearance").draw({ displayChat: false });
var bond = await game.tables.getName("Magic Item Bond").draw({ displayChat: false });
var cost = await game.tables.getName("Magic Item Cost").draw({ displayChat: false });
var effect = await game.tables.getName("Magic Item Effect").draw({ displayChat: false });

aesthetic = aesthetic.results[0].data.text;
appearance = appearance.results[0].data.text;
bond = bond.results[0].data.text;
cost = cost.results[0].data.text;
effect = effect.results[0].data.text;

// Spell effects and effect formatting
if (effect.startsWith("cast [Spell]")) {
    var spell = await game.tables.getName("Spell").draw({ displayChat: false });
    spell = spell.results[0].data.text;
    effect = effect.replace("[Spell]", `<b>${spell}</b>`);
} else {
    effect = `<b>${effect}</b>`
}

const sentence = `<p> 
This item is a(n) <b>${appearance}</b> which seems to be <b>${aesthetic}</b>. It is <b>${bond}</b>. Be careful, for this item <b>${cost}</b>, but it also allows you to ${effect}.
</p>`

const chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: sentence
};

ChatMessage.create(chatData);