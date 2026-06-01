export const styles = {
    container: {
        display: 'flex', flexDirection: 'column', height: '100vh', width: '100%',
        maxWidth: '400px',
        margin: '0 auto', backgroundColor: '#000000', color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative',
        overflow: 'hidden',
        transition: 'max-width 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
    },
    displayArea: {
        flex: '1', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', alignItems: 'flex-end',
        padding: '10px 20px', backgroundColor: '#000000', zIndex: '1'
    },
    inputField: {
        width: '100%', backgroundColor: 'transparent', border: 'none',
        color: '#ffffff', fontSize: '3.5rem', textAlign: 'right',
        outline: 'none', caretColor: '#4caf50', padding: '0',
        transition: 'font-size 0.1s ease-in-out'
    },
    predictDisplay: {
        color: '#888888', fontSize: '1.8rem', minHeight: '2.2rem',
        textAlign: 'right', width: '100%', marginTop: '5px'
    },
    toolbar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 20px', borderBottom: '1px solid #1c1c1c', zIndex: '2'
    },
    toolbarBtn: {
        background: 'none', border: 'none', color: '#888888',
        fontSize: '1.4rem', cursor: 'pointer', padding: '5px 10px'
    },
    historyPanel: {
        display: 'none', position: 'absolute',
        bottom: '20px', left: '20px', right: '20px',
        maxHeight: '55%',
        overflowY: 'auto', flexDirection: 'column', padding: '15px',
        backgroundColor: '#1a1a1a', border: '1px solid #333',
        borderRadius: '15px', zIndex: '100',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
        boxSizing: 'border-box',
        opacity: '0', transition: 'opacity 0.2s ease'
    },
    historyItem: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', cursor: 'pointer' },
    historyExp: { color: '#888888', fontSize: '1.2rem', wordWrap: 'break-word', maxWidth: '100%' },
    historyRes: { color: '#ffffff', fontSize: '1.8rem', wordWrap: 'break-word', maxWidth: '100%' },

    keypadWrapper: {
        display: 'flex', flexWrap: 'wrap', width: '100%', padding: '15px 20px 30px 20px', gap: '10px',
        justifyContent: 'center', backgroundColor: '#000000', boxSizing: 'border-box', zIndex: '1'
    },
    scientificWrapper: {
        width: '0px',
        maxHeight: '1000px',
        marginRight: '0px',
        marginBottom: '0px',
        opacity: '0',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
    },
    scientificPad: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        width: '240px'
    },
    standardPad: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        flex: '2',
        minWidth: '250px'
    },
    button: {
        width: '100%', maxWidth: '75px', aspectRatio: '1', maxHeight: '75px', borderRadius: '50%',
        margin: '0 auto',
        border: 'none', fontSize: '1.6rem', cursor: 'pointer', display: 'flex',
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#252525', color: '#ffffff', userSelect: 'none'
    },
    actionButton: { color: '#4caf50' },
    clearButton: { color: '#ff5252' },
    equalsButton: { backgroundColor: '#4caf50', color: '#000000' },
    converterPanel: {
        display: 'none', flexDirection: 'column', width: '100%', height: '100%',
        backgroundColor: '#000000', color: '#fff', zIndex: '5', padding: '20px',
        boxSizing: 'border-box', position: 'absolute', top: '0', left: '0'
    },
    convHeader: {
        display: 'flex', alignItems: 'center', marginBottom: '30px', marginTop: '10px'
    },
    convBackBtn: {
        background: 'none', border: 'none', color: '#4caf50', fontSize: '2rem',
        cursor: 'pointer', marginRight: '15px', padding: '0 10px'
    },
    convBlock: {
        backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '20px', marginBottom: '15px'
    },
    convSelect: {
        width: '100%', backgroundColor: 'transparent', border: 'none', color: '#4caf50',
        fontSize: '1.2rem', marginBottom: '15px', outline: 'none', cursor: 'pointer'
    },
    convInput: {
        width: '100%', backgroundColor: 'transparent', border: 'none', color: '#ffffff',
        fontSize: '2.5rem', textAlign: 'right', outline: 'none'
    },

    choiceModal: { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', zIndex: '2000' },
    choiceBtn: { padding: '20px', fontSize: '1.2rem', borderRadius: '15px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
    modalOverlay: { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: '1000' },
    cropContainer: { position: 'relative', display: 'inline-block', maxWidth: '100%', maxHeight: '65vh', touchAction: 'none' },
    cropImage: { display: 'block', maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', userSelect: 'none', WebkitUserSelect: 'none' },
    cropBox: { position: 'absolute', border: '2px solid #4caf50', backgroundColor: 'rgba(76, 175, 80, 0.3)', display: 'none', pointerEvents: 'none' },
    cropButton: { marginTop: '20px', padding: '10px 20px', backgroundColor: '#4caf50', color: '#000', border: 'none', borderRadius: '15px', fontSize: '1.2rem', cursor: 'pointer' },
    videoContainer: { position: 'relative', maxWidth: '100%', maxHeight: '65vh', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    videoFeed: { maxWidth: '100%', maxHeight: '100%', display: 'block' }
};

export function applyStyles(element, styleObject) {
    Object.assign(element.style, styleObject);
}