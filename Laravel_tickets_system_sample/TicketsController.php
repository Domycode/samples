<?php

namespace App\Http\Controllers;

use App\Tickets;
use App\TicketsReplies;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

/**
 * Class TicketsController
 * @package App\Http\Controllers
 */
class TicketsController extends Controller
{
    /**
     * @return Tickets
     */
    public function userOpenTickets()
    {
        return Auth::user()->openTickets()->get();
    }

    /**
     * @return Tickets
     */
    public function userClosedTickets()
    {
        return Auth::user()->closedTickets()->get();
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function closeTicket($id, Request $request)
    {
        if ($request->isMethod('patch')) {
            $ticket = Tickets::find($id);
            if ($ticket) {
                $ticket->closeTicket();
            }

            return Auth::user()->openTickets()->get();
        }

        return response()
            ->json([
                'errors' => true
            ]);
    }

    /**
     * @param Request $request
     * @return Tickets|\Illuminate\Http\JsonResponse
     */
    public function createTicket(Request $request)
    {
        if ($request->isMethod('post')) {

            $this->validate($request, [
                'subject' => ['required', 'regex:/^[\w\d\s.,-]*$/', 'max:50'],
                'description' => ['required', 'regex:/^[\w\d\s.,-]*$/', 'max:1000'],
                'server_id' => 'required',
            ]);

            $data = $request->toArray();
            $data['user_id'] = Auth::user()->id;
            $new_ticket = new Tickets($data);
            $new_ticket->save();

            return $new_ticket;
        }

        return response()
            ->json([
                'errors' => true
            ]);
    }

    /**
     * @param Request $request
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function createReply(Request $request)
    {
        if ($request->isMethod('post')) {

            $this->validate($request, [
                'reply' => 'required',
                'ticket_id' => 'required',
            ]);
            $data = $request->toArray();
            $data['from'] = TicketsReplies::FROM_USER;
            $reply = new TicketsReplies($data);
            $reply->save();
            $reply->ticket()->touch();
            $ticket = $reply->ticket()->get()->first();

            if ($ticket->isClosed()) {
                $ticket->changeStatus();
            }

            return [
                'open' => $this->userOpenTickets(),
                'closed' => $this->userClosedTickets()
            ];
        }

        return response()
            ->json([
                'errors' => true
            ]);
    }
}
