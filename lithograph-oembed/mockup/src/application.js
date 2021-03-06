const React = require("react");
const { List, Record } = require("immutable");

const OEmbed = require("./oembed");
const LoremIpsum = React.createElement(require("./lorem-ipsum"));
const InputBar = require("./input-bar");
const Placeholder = <div/>;


const Application = Object.assign(props => Application[props.data.state](props),
{
    Data: Record({ state:"initial", URL:"", interactive: true, items: null, input:"" }),

    initial({ data: { URL }, keyPath, update })
    {
        const params = new URLSearchParams(URL.split("?")[1]);
        const interactive = params.has("items");
        const encoded = interactive ?
            params.getAll("items") :
            ["0", Placeholder, "0"];
        const items = List(encoded.map(
            item => item === Placeholder ?
                Placeholder :
                item === "0" ?
                    LoremIpsum :
                    OEmbed.Data({ URL: item })));

        update(keyPath, data =>
            data.set("state", "loaded")
                .set("items", items)
                .set("interactive", interactive));

        return <div/>;
    },

    loaded: ({ data: { items, interactive, input }, keyPath, update }) =>
    {
        const onOEmbedURLChange = URL =>
            update([...keyPath, "items", 1], () => OEmbed.Data({ URL }));

        return  <div id = "page" style = { { position: "relative" } }>
                    <BluePrint/>
                    <InputBar   data = { input }
                                keyPath = { [...keyPath, "input"] }
                                update = { update }
                                action = { onOEmbedURLChange } />
                    {
                        items.map((item, index) =>
                            !(item instanceof OEmbed.Data) ?
                                item :
                                <OEmbed
                                    keyPath = { [...keyPath, "items", index] }
                                    update = { update }
                                    data = { item } />)
                    }
                </div>;
    }
});

const BluePrint = function ()
{
    const style =
    {
        position: "fixed",
        height: "100vh",
        minHeight: "100%",
        width: "inherit",
        top:"0",
        borderLeft:"1px dashed rgba(77, 103, 179, 1.0)",
        borderRight:"1px dashed rgba(77, 103, 179, 1.0)",
        zIndex:-1000
    };

    return <div style = { style } />;
}

module.exports = Application;
