import withAuth from '../components/withAuth'

function Welcome() {
    return (
        <div>Welcome</div>
    )
}
export default withAuth(Welcome)
