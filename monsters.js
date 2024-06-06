// Function to only get a Beast (for prefix and suffix processing)
async function getBeast() {
    // Beast Subtype
    var beast_subtype = await game.tables.getName("Beast Type").draw({ displayChat: false });
    beast_subtype = beast_subtype.results[0].data.text;

    // Beast Specific
    var beast_specific_table = `${beast_subtype} Beast`;
    var beast_specific = await game.tables.getName(beast_specific_table).draw({ displayChat: false });
    beast_specific = beast_specific.results[0].data.text;

    return beast_specific;
}

// Function to handle Suffix (ex: Hawk + [Ability])
async function handleSuffix(creature_specific) {
    var regex = /\+\s\[(.+)\]/;
    var result = regex.exec(creature_specific);
    if (result !== null) {
        var suffix = result[1];
        if (suffix == "Ability" || suffix == "Aberrance" || suffix == "Element" || suffix == "Oddity") {
            var suffix_specific = await game.tables.getName(suffix).draw({ displayChat: false });
            suffix_specific = suffix_specific.results[0].data.text;
            var replace_regex = /\[\w+\]/;
            return creature_specific.replace(replace_regex, suffix_specific);

        } else if (suffix == "Beast") {
            var suffix_specific = await getBeast();
            var replace_regex = /\[\w+\]/;
            return creature_specific.replace(replace_regex, suffix_specific);
        }
    } else {
        return creature_specific;
    }
}

// Function to handle Prefix (ex: [Beast] + Fire)
async function handlePrefix(creature_specific) {
    if (creature_specific.startsWith("[Beast]")) {
        var prefix = await getBeast();
        creature_specific = creature_specific.replace("[Beast]", prefix);
        return creature_specific;
    } else {
        return creature_specific;
    }
}

// Function to get a random creature (Creature type -> subtype -> specific -> prefix/suffix handling)
async function getCreature() {

    // Creature Type table
    var creature_type = await game.tables.getName("Creature Type").draw({ displayChat: false });
    creature_type = creature_type.results[0].data.text;

    // Creature Subtype Table (ex: Beast Type)
    var creature_table_name = `${creature_type} Type`;
    var creature_subtype = await game.tables.getName(creature_table_name).draw({ displayChat: false });
    creature_subtype = creature_subtype.results[0].data.text;

    // Creature Specific Table (ex: Earthbound Beast)
    var creature_specific_table = `${creature_subtype} ${creature_type}`;
    var creature_specific = await game.tables.getName(creature_specific_table).draw({ displayChat: false });
    creature_specific = creature_specific.results[0].data.text;

    // Handle snowflake prefix (ex: [Beast] + volcanic)
    creature_specific = await handlePrefix(creature_specific);

    // Handle snowflake suffix (ex: Hawk + [Ability])
    creature_specific = await handleSuffix(creature_specific);



    // Done
    return creature_specific;

}

var creature = await getCreature();

const chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: creature
};

ChatMessage.create(chatData);